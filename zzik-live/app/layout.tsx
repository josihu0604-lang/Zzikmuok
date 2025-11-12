import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZZIK LIVE - 카페 가서 사진만 찍으면 월 15만원",
  description: "일상 속 카페, 맛집 방문이 수익이 되는 플랫폼. 전국 10,000개+ 매장에서 미션을 기다리고 있어요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
