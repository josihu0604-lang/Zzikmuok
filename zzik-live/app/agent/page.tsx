/**
 * ZZIK Claude Agent Page
 * 
 * Main page for interacting with the AI assistant
 */

import AgentChat from '@/components/agent/AgentChat';
import { Sparkles, MessageSquare, MapPin, Bookmark } from 'lucide-react';

export const metadata = {
  title: 'AI 에이전트 - ZZIK LIVE',
  description: 'Claude 기반 AI 에이전트와 대화하며 촬영 스팟을 찾고 조언을 받으세요.',
};

export default function AgentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ZZIK AI 에이전트
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Claude 3.5 Sonnet 기반 위치 인식 AI 어시스턴트
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  장소 검색
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                현재 위치 기반으로 근처 촬영 스팟을 찾아드립니다
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  촬영 조언
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                촬영 팁, 구도, 시간대 등 실용적인 조언을 제공합니다
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Bookmark className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  북마크 관리
                </h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                마음에 드는 장소를 저장하고 메모를 추가하세요
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-primary-900 dark:text-primary-100 font-medium mb-1">
                  AI 에이전트 사용 팁
                </p>
                <ul className="text-primary-700 dark:text-primary-300 space-y-1 text-xs">
                  <li>• "근처 카페 촬영 스팟 추천해줘" - 장소 검색</li>
                  <li>• "야경 촬영 팁 알려줘" - 촬영 조언</li>
                  <li>• "이 장소 북마크해줘" - 저장 관리</li>
                  <li>• 위치 공유 시 더 정확한 추천을 받을 수 있습니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <AgentChat />
      </div>
    </main>
  );
}
