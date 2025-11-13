import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerProvider } from "@/components/ServiceWorkerProvider";
import { WebVitalsProvider } from "@/components/WebVitalsProvider";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
// DEV/HYGIENE: Console gate activation (dev only)
import "@/lib/dev/console-gate";

// Load Inter font (fallback for Pretendard which is loaded via CSS)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'),
  title: "ZZIK LIVE - 카페 가서 사진만 찍으면 월 15만원",
  description: "일상 속 카페, 맛집 방문이 수익이 되는 플랫폼. 전국 10,000개+ 매장에서 미션을 기다리고 있어요.",
  applicationName: "ZZIK LIVE",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ZZIK LIVE",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ZZIK LIVE",
    title: "ZZIK LIVE - 나노 크리에이터 미션 플랫폼",
    description: "일상 속 카페, 맛집 방문이 수익이 되는 플랫폼",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZZIK LIVE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZZIK LIVE - 나노 크리에이터 미션 플랫폼",
    description: "일상 속 카페, 맛집 방문이 수익이 되는 플랫폼",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="ZZIK LIVE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ZZIK LIVE" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
        
        {/* Splash Screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          href="/splash/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AnalyticsProvider>
          <WebVitalsProvider />
          <ErrorBoundary>
            <ToastProvider>
              <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
            </ToastProvider>
          </ErrorBoundary>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
