/**
 * Privacy & Analytics Consent Card
 * 
 * Displays in Settings > Privacy
 * Allows users to opt-in/opt-out of analytics tracking
 */

'use client';

import { useState, useEffect } from 'react';
import { setConsent } from '@/lib/analytics/client';

export function PrivacyCard() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load consent status on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('zzik:consent:analytics') === 'true';
      setAnalyticsEnabled(consent);
      setLoading(false);
    }
  }, []);

  const handleToggle = () => {
    const newValue = !analyticsEnabled;
    setAnalyticsEnabled(newValue);
    setConsent(newValue);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="animate-pulse h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            사용성 분석
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            앱 개선을 위한 익명 사용 데이터 수집
          </p>
        </div>
        
        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${analyticsEnabled ? 'bg-primary-600' : 'bg-gray-300'}
          `}
          role="switch"
          aria-checked={analyticsEnabled}
          aria-label="사용성 분석 토글"
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${analyticsEnabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex items-start gap-2">
          <span className="text-green-600 mt-0.5">✓</span>
          <p>익명 사용 패턴 분석</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-green-600 mt-0.5">✓</span>
          <p>성능 개선 데이터 수집</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-600 mt-0.5">✗</span>
          <p>개인정보 (이메일, 전화번호) 미수집</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-600 mt-0.5">✗</span>
          <p>정확한 위치 정보 미전송</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <span
          className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
            ${analyticsEnabled
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
            }
          `}
        >
          <span
            className={`
              h-2 w-2 rounded-full
              ${analyticsEnabled ? 'bg-green-600' : 'bg-gray-400'}
            `}
          />
          {analyticsEnabled ? '활성화됨' : '비활성화됨'}
        </span>
      </div>

      {/* Learn More Link */}
      <button
        onClick={() => window.open('/privacy-policy', '_blank')}
        className="mt-4 text-sm text-primary-600 hover:text-primary-700 hover:underline"
      >
        개인정보 처리방침 자세히 보기 →
      </button>
    </div>
  );
}

/**
 * First-time Consent Banner
 * 
 * Shows on initial app load if consent not yet decided
 */
export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('zzik:consent:analytics');
      // Show banner only if consent never decided
      if (consent === null) {
        setShow(true);
      }
    }
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setShow(false);
  };

  const handleDecline = () => {
    setConsent(false);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pb-safe">
      <div className="bg-white border-t border-gray-200 shadow-2xl p-6">
        <div className="max-w-xl mx-auto">
          {/* Icon */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="h-5 w-5 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              더 나은 경험을 위해
            </h3>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-700 mb-4">
            익명 사용 데이터를 수집하여 앱을 개선합니다. 개인정보는 수집하지 않으며, 언제든지 설정에서 변경할 수 있습니다.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              동의
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              거부
            </button>
          </div>

          {/* Privacy Link */}
          <button
            onClick={() => window.open('/privacy-policy', '_blank')}
            className="w-full mt-3 text-xs text-gray-600 hover:text-gray-900 hover:underline"
          >
            개인정보 처리방침
          </button>
        </div>
      </div>
    </div>
  );
}
