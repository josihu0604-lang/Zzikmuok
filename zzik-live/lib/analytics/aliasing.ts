/**
 * Event Name Aliasing for Backward Compatibility
 * 
 * Purpose: Support schema evolution without breaking existing clients
 * 
 * Use cases:
 * - Rename events (post_view → post_view_start/end)
 * - Consolidate events
 * - Deprecate old event names gradually
 * 
 * Strategy:
 * 1. Client sends old or new event name
 * 2. Server normalizes to canonical name
 * 3. Original name preserved in props.original_name
 * 4. Analytics queries use canonical names only
 */

import type { EventName } from './schema';

/**
 * Event name alias map
 * Key: Old/deprecated name
 * Value: Canonical name
 */
export const EVENT_ALIASES: Record<string, EventName> = {
  // Backward compatibility for post_view split
  'post_view': 'post_view_start',  // Default to start for old clients
  
  // Future aliases (examples)
  // 'video_start': 'video_play',
  // 'video_stop': 'video_pause',
  // 'item_visible': 'feed_item_visible',
};

/**
 * Normalize event name to canonical form
 * 
 * @param eventName - Original event name from client
 * @returns Canonical event name
 * 
 * @example
 * ```typescript
 * normalizeEventName('post_view')      // → 'post_view_start'
 * normalizeEventName('post_view_start') // → 'post_view_start'
 * normalizeEventName('pin_tap')        // → 'pin_tap'
 * ```
 */
export function normalizeEventName(eventName: string): EventName {
  // Check if it's an alias
  if (eventName in EVENT_ALIASES) {
    return EVENT_ALIASES[eventName as keyof typeof EVENT_ALIASES];
  }
  
  // Return as-is if already canonical
  return eventName as EventName;
}

/**
 * Check if event name is an alias
 */
export function isAlias(eventName: string): boolean {
  return eventName in EVENT_ALIASES;
}

/**
 * Get original name from canonical name (reverse lookup)
 * Returns undefined if no alias exists
 */
export function getAliasesFor(canonicalName: EventName): string[] {
  return Object.entries(EVENT_ALIASES)
    .filter(([_, canonical]) => canonical === canonicalName)
    .map(([alias, _]) => alias);
}

/**
 * Aliasing metadata for analytics
 * Helps track migration progress
 */
export type AliasingMetadata = {
  originalName: string;
  canonicalName: EventName;
  wasAliased: boolean;
  aliasedAt: Date;
};

/**
 * Create aliasing metadata
 */
export function createAliasingMetadata(
  originalName: string,
  canonicalName: EventName
): AliasingMetadata {
  return {
    originalName,
    canonicalName,
    wasAliased: originalName !== canonicalName,
    aliasedAt: new Date(),
  };
}

/**
 * Migration tracking query (for Supabase)
 * Run this to see how many clients are using old names
 * 
 * ```sql
 * SELECT
 *   props->>'original_name' AS original_name,
 *   name AS canonical_name,
 *   COUNT(*) AS event_count,
 *   COUNT(DISTINCT device_id) AS unique_devices
 * FROM analytics_events
 * WHERE props ? 'original_name'
 *   AND ts_server >= NOW() - INTERVAL '7 days'
 * GROUP BY 1, 2
 * ORDER BY event_count DESC;
 * ```
 */

/**
 * Deprecation policy
 * 
 * 1. **Phase 1 (Week 1-2): Add new event name**
 *    - Clients can use either old or new name
 *    - Server accepts both
 *    - Analytics use canonical name
 * 
 * 2. **Phase 2 (Week 3-4): Encourage migration**
 *    - Update SDK to use new name
 *    - Add console warning for old name (dev only)
 *    - Monitor usage via migration tracking query
 * 
 * 3. **Phase 3 (Week 5-8): Deprecate old name**
 *    - SDK only sends new name
 *    - Server still accepts old name (for old app versions)
 *    - Add deprecation notice in docs
 * 
 * 4. **Phase 4 (Month 3+): Remove alias**
 *    - Remove from EVENT_ALIASES map
 *    - Server rejects old name (400 Bad Request)
 *    - Ensure old app versions < 1% of traffic
 */
