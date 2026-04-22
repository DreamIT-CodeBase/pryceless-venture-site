import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pryceless Venture",
  description:
    "Real estate financing, acquisitions, and analytics for operators, borrowers, and deal-focused teams.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      className={poppins.variable}
      data-scroll-behavior="smooth"
      lang="en"
    >
      <body className="antialiased">
        <Script id="pv-browser-flag" strategy="beforeInteractive">
          {`
            (function () {
              var ua = navigator.userAgent || "";
              var isEdge = /Edg\\//.test(ua);
              var isChrome = !isEdge && /Chrome\\//.test(ua) && !/OPR\\//.test(ua);
              if (isChrome) {
                document.documentElement.setAttribute("data-browser", "chrome");
              } else if (isEdge) {
                document.documentElement.setAttribute("data-browser", "edge");
              }
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
