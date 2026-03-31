"use client";

import { useRef, useState } from "react";

export function InvestmentVideoPreview({
  posterSrc,
  title,
  videoSrc,
}: {
  posterSrc: string;
  title: string;
  videoSrc: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = async () => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (videoElement.ended) {
      videoElement.currentTime = 0;
    }

    try {
      setHasStarted(true);
      await videoElement.play();
    } catch {
      setHasStarted(false);
    }
  };

  return (
    <div className="relative min-h-[330px] overflow-hidden rounded-[15px] bg-[#18243f] lg:h-[330px]">
      <video
        className="h-full w-full object-cover"
        controls={hasStarted}
        onEnded={() => setHasStarted(false)}
        onPlay={() => setHasStarted(true)}
        playsInline
        poster={posterSrc}
        preload="metadata"
        ref={videoRef}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-[rgba(12,22,41,0.32)] transition-opacity duration-300 ${
          hasStarted ? "opacity-0" : "opacity-100"
        }`}
      />

      <button
        aria-label={`Play video: ${title}`}
        className={`absolute left-1/2 top-1/2 grid h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--pv-sand)] transition-all duration-300 hover:brightness-95 ${
          hasStarted ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        onClick={handlePlay}
        type="button"
      >
        <svg aria-hidden="true" className="ml-[4px] h-[31px] w-[31px] fill-white" viewBox="0 0 24 24">
          <path d="M8 5.14v13.72c0 .68.74 1.1 1.33.74l10.2-6.86a.86.86 0 0 0 0-1.48L9.33 4.4A.86.86 0 0 0 8 5.14Z" />
        </svg>
      </button>
    </div>
  );
}
