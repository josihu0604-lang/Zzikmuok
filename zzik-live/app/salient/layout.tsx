import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZZIK LIVE (Salient) - 카페 미션으로 월 15만원",
  description: "Salient 템플릿으로 구현된 ZZIK LIVE 크리에이터 랜딩 페이지. Income Calculator, Testimonials, FAQ 포함.",
};

export default function SalientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
