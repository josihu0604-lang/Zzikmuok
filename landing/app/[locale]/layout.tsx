import type { ReactNode } from 'react';
export default async function Layout({children, params}:{children:ReactNode; params:Promise<{locale:string}>}){
  const { locale } = await params;
  const lang=['ko','ja-JP','zh-CN'].includes(locale)?locale:'ko';
  return (<html lang={lang}><body>{children}</body></html>);
}
