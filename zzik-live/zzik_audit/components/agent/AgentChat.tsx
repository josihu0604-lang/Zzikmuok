/**
 * ZZIK Claude Agent Chat UI Component
 * 
 * Features:
 * - Real-time chat interface with Claude
 * - Location sharing for context-aware responses
 * - Message history display
 * - Loading states
 * - Error handling
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Loader2, User, Bot } from 'lucide-react';

type Msg = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AgentChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: '안녕하세요! ZZIK 에이전트입니다. 🎯\n\n근처 촬영 스팟을 찾거나, 장소 추천, UX/UI 조언 등 무엇이든 물어보세요!',
    },
  ]);
  const [input, setInput] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Request geolocation
  const requestGeo = () => {
    if (!navigator.geolocation) {
      setError('브라우저가 위치 서비스를 지원하지 않습니다.');
      return;
    }

    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.');
      }
    );
  };

  // Send message to agent
  const send = async () => {
    if (!input.trim() || pending) return;

    const userMessage = input.trim();
    const next = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(next);
    setInput('');
    setPending(true);
    setError(null);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          coords: coords || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '응답을 받을 수 없습니다.');
      }

      if (data?.text) {
        setMessages([...next, { role: 'assistant', content: data.text }]);
      } else {
        throw new Error('응답이 비어있습니다.');
      }
    } catch (e) {
      console.error('Agent error:', e);
      const errorMsg =
        e instanceof Error ? e.message : '네트워크 오류가 발생했습니다.';
      setError(errorMsg);
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: `죄송합니다. ${errorMsg}\n\n다시 시도해주세요.`,
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
      {/* Location Bar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-t-xl border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={requestGeo}
            disabled={pending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              {coords ? '위치 업데이트' : '현재 위치 사용'}
            </span>
          </button>
          {coords && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs"
            >
              <MapPin className="w-3 h-3" />
              <span>
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </motion.div>
          )}
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
              )}
              
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {m.content}
                </div>
              </div>

              {m.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {pending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>생각 중...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="근처 촬영 스팟 추천해줘"
            disabled={pending}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={pending || !input.trim()}
            className="px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {pending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">보내기</span>
              </>
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Shift + Enter로 줄바꿈
        </div>
      </div>
    </div>
  );
}
