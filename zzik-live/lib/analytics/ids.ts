/**
 * Device & Session ID Management
 * 
 * - Device ID: Persistent UUID in localStorage
 * - Session ID: 30-minute TTL, regenerated on inactivity
 */

const KEY_DEVICE = 'zzik:device_id';
const KEY_SESSION = 'zzik:session_id';
const KEY_SESSION_AT = 'zzik:session_at';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Get or create device ID
 * @returns Persistent device UUID
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';

  let id = localStorage.getItem(KEY_DEVICE);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY_DEVICE, id);
  }
  return id;
}

/**
 * Get or create session ID (with 30min TTL)
 * @returns Session UUID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';

  const now = Date.now();
  let id = localStorage.getItem(KEY_SESSION);
  const lastActivity = Number(localStorage.getItem(KEY_SESSION_AT) ?? 0);

  // Regenerate if expired or missing
  if (!id || now - lastActivity > SESSION_TTL_MS) {
    id = crypto.randomUUID();
  }

  // Update session activity
  localStorage.setItem(KEY_SESSION, id);
  localStorage.setItem(KEY_SESSION_AT, String(now));

  return id;
}

/**
 * Clear all analytics IDs (for testing)
 */
export function clearIds(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(KEY_DEVICE);
  localStorage.removeItem(KEY_SESSION);
  localStorage.removeItem(KEY_SESSION_AT);
}
