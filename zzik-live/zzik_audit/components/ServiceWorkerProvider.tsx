'use client';

import { useEffect, useState } from 'react';
import {
  registerServiceWorker,
  checkForUpdates,
  skipWaitingAndReload,
  isStandalone,
} from '@/lib/register-sw';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/design-system/Button';
import { RefreshCw, X } from 'lucide-react';

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    registerServiceWorker({
      onSuccess: (registration) => {
        console.log('✅ Service Worker registered successfully');
        
        // Check for updates every 60 seconds
        setInterval(() => {
          checkForUpdates();
        }, 60 * 1000);
      },
      onUpdate: (registration) => {
        console.log('🔄 New Service Worker available');
        setUpdateAvailable(true);
      },
      onError: (error) => {
        console.error('❌ Service Worker registration failed:', error);
      },
    });

    // Show install prompt if not standalone
    if (!isStandalone()) {
      // Wait 30 seconds before showing install prompt
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleUpdate = () => {
    skipWaitingAndReload();
  };

  const handleDismissUpdate = () => {
    setUpdateAvailable(false);
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
  };

  return (
    <>
      {children}
      
      {/* Update Available Toast */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">
                    새로운 업데이트 사용 가능
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    새로운 기능과 개선사항이 준비되었습니다
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleUpdate}
                      icon={<RefreshCw className="w-4 h-4" />}
                    >
                      업데이트
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismissUpdate}
                    >
                      나중에
                    </Button>
                  </div>
                </div>
                
                <button
                  onClick={handleDismissUpdate}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Install Prompt Toast */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0 text-white">
                  <h3 className="text-base font-semibold">
                    📱 앱으로 설치하기
                  </h3>
                  <p className="text-sm text-white/90 mt-1">
                    홈 화면에 추가하면 더 편리하게 이용할 수 있어요
                  </p>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDismissInstall}
                    >
                      확인
                    </Button>
                  </div>
                </div>
                
                <button
                  onClick={handleDismissInstall}
                  className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
