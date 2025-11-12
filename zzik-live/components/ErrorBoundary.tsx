'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/design-system';

/**
 * Error Boundary Component - ZZIK LIVE
 * 
 * Catches JavaScript errors in child components and displays fallback UI
 * Prevents entire app from crashing due to component errors
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Error Boundary] Caught error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // Send to error tracking service (Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Error Fallback UI
 */
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  onGoHome: () => void;
}

function ErrorFallback({
  error,
  errorInfo,
  onReset,
  onGoHome,
}: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-error-100 flex items-center justify-center"
        >
          <AlertTriangle className="w-10 h-10 text-error-600" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            앗, 문제가 발생했어요
          </h1>
          <p className="text-gray-600 text-center mb-6">
            예상치 못한 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>

          {/* Development Error Details */}
          {isDevelopment && error && (
            <details className="mb-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                개발자 정보 (디버그용)
              </summary>
              <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono overflow-auto max-h-40">
                <div className="text-error-600 font-bold mb-2">
                  {error.name}: {error.message}
                </div>
                <div className="text-gray-600 whitespace-pre-wrap">
                  {error.stack}
                </div>
                {errorInfo && (
                  <div className="mt-4 text-gray-600">
                    <div className="font-bold mb-1">Component Stack:</div>
                    {errorInfo.componentStack}
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              fullWidth
              onClick={onReset}
              icon={<RefreshCw className="w-5 h-5" />}
            >
              다시 시도
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={onGoHome}
              icon={<Home className="w-5 h-5" />}
            >
              홈으로 이동
            </Button>
          </div>
        </motion.div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500">
          문제가 계속되면{' '}
          <a
            href="mailto:support@zziклive.com"
            className="text-primary-600 hover:underline"
          >
            고객센터
          </a>
          로 문의해주세요
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Simple Error Boundary for inline use
 */
export function SimpleErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 bg-error-50 border border-error-200 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-error-600" />
            <h3 className="font-semibold text-error-900">
              콘텐츠를 불러올 수 없습니다
            </h3>
          </div>
          <p className="text-sm text-error-700 mb-4">
            일시적인 문제가 발생했습니다. 페이지를 새로고침 해주세요.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            새로고침
          </Button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
