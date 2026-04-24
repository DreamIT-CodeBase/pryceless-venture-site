"use client";

import { useEffect, useRef } from "react";

type ExternalFormEmbedProps = {
  borderRadius?: number | string;
  className?: string;
  formId: string;
  formName: string;
  height: number;
  loading?: "eager" | "lazy";
  src: string;
  title: string;
};

export function ExternalFormEmbed({
  borderRadius = 3,
  className = "",
  formId,
  formName,
  height,
  loading = "eager",
  src,
  title,
}: ExternalFormEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeIdRef = useRef(`inline-${formId}-${Math.random().toString(36).slice(2, 10)}`);
  const iframeId = iframeIdRef.current;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.id = iframeId;
    iframe.title = title;
    iframe.src = src;
    iframe.loading = loading;
    iframe.scrolling = "no";
    iframe.className = "block w-full";
    iframe.setAttribute("data-activation-type", "alwaysActivated");
    iframe.setAttribute("data-activation-value", "");
    iframe.setAttribute("data-deactivation-type", "neverDeactivate");
    iframe.setAttribute("data-deactivation-value", "");
    iframe.setAttribute("data-form-id", formId);
    iframe.setAttribute("data-form-name", formName);
    iframe.setAttribute("data-height", String(height));
    iframe.setAttribute("data-layout", '{"id":"INLINE"}');
    iframe.setAttribute("data-layout-iframe-id", iframeId);
    iframe.setAttribute("data-trigger-type", "alwaysShow");
    iframe.setAttribute("data-trigger-value", "");
    iframe.style.width = "100%";
    iframe.style.minHeight = `${height}px`;
    iframe.style.height = `${height}px`;
    iframe.style.border = "none";
    iframe.style.borderRadius =
      typeof borderRadius === "number" ? `${borderRadius}px` : String(borderRadius);
    iframe.style.display = "block";
    iframe.style.overflow = "hidden";
    iframe.style.background = "transparent";

    const script = document.createElement("script");
    script.src = "https://media.prycelessventures.com/js/form_embed.js";
    script.async = true;

    container.replaceChildren(iframe, script);

    return () => {
      const mountedIframe = document.getElementById(iframeId);
      if (mountedIframe instanceof HTMLIFrameElement) {
        mountedIframe.remove();
      }

      if (container.isConnected) {
        container.replaceChildren();
      } else {
        container.textContent = "";
      }
    };
  }, [borderRadius, formId, formName, height, iframeId, loading, src, title]);

  return (
    <div
      className={`block w-full ${className}`.trim()}
      ref={containerRef}
      style={{ minHeight: `${height}px` }}
    />
  );
}


