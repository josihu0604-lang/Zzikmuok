import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZZIK LIVE (Pocket) - 앱 다운로드 | 카페 미션 플랫폼",
  description: "Pocket 템플릿으로 구현된 ZZIK LIVE 앱 다운로드 페이지. Glass morphism 디자인과 모바일 앱 미리보기.",
};

export default function PocketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
