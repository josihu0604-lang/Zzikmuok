'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Theme Provider - ZZIK LIVE
 * 
 * Provides dark/light mode toggle functionality
 * - Persists theme preference to localStorage
 * - Syncs with system theme preference
 * - Smooth theme transitions
 * - Toggle button component
 */

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/**
 * Theme Provider Component
 */
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'zzik-live-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Get system theme preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }, []);

  // Resolve theme based on preference
  const resolveTheme = useCallback(
    (themeValue: Theme): 'light' | 'dark' => {
      if (themeValue === 'system') {
        return getSystemTheme();
      }
      return themeValue;
    },
    [getSystemTheme]
  );

  // Apply theme to document
  const applyTheme = useCallback((themeValue: 'light' | 'dark') => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the new theme class
    root.classList.add(themeValue);
    
    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        themeValue === 'dark' ? '#1F2937' : '#8B5CF6'
      );
    }
  }, []);

  // Set theme and persist
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      
      // Save to localStorage
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }

      // Resolve and apply theme
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    },
    [storageKey, resolveTheme, applyTheme]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setTheme]);

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      const initialTheme = stored || defaultTheme;
      const resolved = resolveTheme(initialTheme);
      
      setThemeState(initialTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    }
  }, [storageKey, defaultTheme, resolveTheme, applyTheme, getSystemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Theme Toggle Button Component
 */
interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-xl
        bg-gray-100 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        transition-colors duration-200
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle Background */}
      <div className="relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full">
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 700,
            damping: 30,
          }}
          className="absolute top-0.5 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center"
          style={{
            left: isDark ? '26px' : '2px',
          }}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-primary-400" />
          ) : (
            <Sun className="w-3 h-3 text-warning-500" />
          )}
        </motion.div>
      </div>

      {/* Label */}
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isDark ? '다크 모드' : '라이트 모드'}
        </span>
      )}
    </motion.button>
  );
}

/**
 * Simple Theme Toggle Icon Button
 */
export function ThemeToggleIcon() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <AnimatedIcon isDark={isDark} />
    </motion.button>
  );
}

/**
 * Animated Icon Component
 */
function AnimatedIcon({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative w-5 h-5">
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0"
      >
        <Sun className="w-5 h-5 text-warning-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0"
      >
        <Moon className="w-5 h-5 text-primary-400" />
      </motion.div>
    </div>
  );
}

export default ThemeProvider;
