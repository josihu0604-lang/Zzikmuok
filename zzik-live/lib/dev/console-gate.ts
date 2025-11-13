/**
 * Console Gate - Development Runtime Console Monitor
 * 
 * Blocks unexpected console errors/warnings in development to ensure
 * console cleanliness. Only whitelisted patterns are allowed.
 * 
 * Usage: Import at the top of app/layout.tsx (development only)
 * 
 * Phase: DEV/HYGIENE Sprint
 */

if (process.env.NODE_ENV !== 'production') {
  // Whitelist: Patterns that are expected/acceptable
  const ALLOW_PATTERNS = [
    // Next.js development messages
    /Prefetching/,
    /React\.StrictMode double-invoke/,
    /Download the React DevTools/,
    
    // Expected development warnings
    /Fast Refresh/,
    /Hot Module Replacement/,
    
    // External library development noise (non-critical)
    /ERR_BLOCKED_BY_ORB/, // Browser security feature, image loads successfully
  ];

  // Store original console methods
  const originalError = console.error.bind(console);
  const originalWarn = console.warn.bind(console);

  /**
   * Check if message matches allowed patterns
   */
  function isAllowed(message: string): boolean {
    return ALLOW_PATTERNS.some(pattern => pattern.test(message));
  }

  /**
   * Override console.error - throw on unexpected errors
   */
  console.error = (...args: any[]) => {
    const message = String(args[0]);
    
    if (!isAllowed(message)) {
      // Log the error details
      originalError('🚨 [Console Gate] Unexpected error detected:', ...args);
      
      // Throw to fail fast and force resolution
      throw new Error(`Unexpected console.error: ${message}`);
    }
    
    // Allowed error, let it through
    originalError(...args);
  };

  /**
   * Override console.warn - convert to error for unexpected warnings
   */
  console.warn = (...args: any[]) => {
    const message = String(args[0]);
    
    if (!isAllowed(message)) {
      // Treat unexpected warnings as errors
      originalError('⚠️  [Console Gate] Unexpected warning detected:', ...args);
      
      // Optionally: throw to enforce strictness
      // throw new Error(`Unexpected console.warn: ${message}`);
      
      // For now: just escalate to error level
      originalError('[WARN→ERROR]', ...args);
    } else {
      // Allowed warning
      originalWarn(...args);
    }
  };

  // Log gate activation
  console.warn('🛡️  [Console Gate] Active - Only whitelisted console messages allowed');
}

export {};
