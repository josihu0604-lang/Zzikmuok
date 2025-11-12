export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-white">
          ZZIK LIVE
        </h1>
        <p className="text-xl text-slate-300">
          카페 가서 사진만 찍으면 월 15만원
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/salient" 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Salient 템플릿 보기
          </a>
          <a 
            href="/pocket" 
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Pocket 템플릿 보기
          </a>
        </div>
      </div>
    </div>
  );
}