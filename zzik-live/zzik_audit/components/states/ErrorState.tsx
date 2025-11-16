import { AlertCircle, ServerCrash, WifiOff, Lock, SearchX } from 'lucide-react';

type ErrorType = 'network' | 'server' | 'not-found' | 'unauthorized' | 'generic';

const errorConfig = {
  network: {
    icon: WifiOff,
    title: '인터넷 연결 없음',
    description: '네트워크 연결을 확인해주세요',
    action: '다시 시도',
  },
  server: {
    icon: ServerCrash,
    title: '서버 오류',
    description: '잠시 후 다시 시도해주세요',
    action: '다시 시도',
  },
  'not-found': {
    icon: SearchX,
    title: '페이지를 찾을 수 없습니다',
    description: 'URL을 확인하거나 홈으로 돌아가세요',
    action: '홈으로',
  },
  unauthorized: {
    icon: Lock,
    title: '권한이 없습니다',
    description: '로그인이 필요한 페이지입니다',
    action: '로그인',
  },
  generic: {
    icon: AlertCircle,
    title: '문제가 발생했습니다',
    description: '다시 시도해주세요',
    action: '다시 시도',
  },
};

export default function ErrorState({
  type = 'generic',
  error,
  onRetry,
}: {
  type?: ErrorType;
  error?: Error;
  onRetry?: () => void;
}) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
      <Icon className="h-16 w-16 text-red-500 mb-4" aria-hidden="true" />
      <h3 className="text-xl font-semibold mb-2 text-[color:var(--text-primary)]">
        {config.title}
      </h3>
      <p className="text-sm text-[color:var(--text-tertiary)] mb-6 text-center">
        {config.description}
      </p>
      {error && process.env.NODE_ENV === 'development' && (
        <pre className="text-xs text-[color:var(--text-tertiary)] mb-4 p-2 bg-[color:var(--bg-secondary)] rounded overflow-auto max-w-full">
          {error.stack}
        </pre>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="min-h-[48px] px-6 py-2 bg-[color:var(--interactive-primary)] hover:bg-[color:var(--interactive-primary-hover)] text-white rounded-lg transition-colors"
        >
          {config.action}
        </button>
      )}
    </div>
  );
}
