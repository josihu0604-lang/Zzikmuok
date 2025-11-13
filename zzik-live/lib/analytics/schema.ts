/**
 * Analytics Event Schema (Version 1)
 * 
 * Naming convention: noun_verb or surface_action (snake_case)
 * Privacy: NO PII (email, phone, exact address)
 * Coordinates: Use geohash or 150m snap (if needed)
 */

import { z } from 'zod';

export type EventName =
  | 'pin_tap'
  | 'place_sheet_open'
  | 'post_view_start'
  | 'post_view_end'
  | 'feed_item_visible'
  | 'like_toggle'
  | 'save_toggle'
  | 'error'
  | 'perf_web_vitals'
  | 'exp_exposure'
  | 'app_start'
  | 'screen_view';

export type BuildPlatform = 'web' | 'ios' | 'android' | 'desktop';

export type EventContext = {
  app_version: string;
  build: BuildPlatform;
  locale: string;
  timezone: string;
  screen: {
    width: number;
    height: number;
    dpr: number;
  };
  device_id: string;
  session_id: string;
  user_id?: string;
  flags?: Record<string, boolean>;
  experiments?: Record<string, string>;
};

export type EventPayload<N extends EventName = EventName> = {
  event_id?: string;
  name: N;
  schema_version: number;
  ts_client: number; // ms epoch
  context: EventContext;
  props: EventProps<N>;
};

// Event-specific properties
export type EventProps<N extends EventName> = N extends 'pin_tap'
  ? PinTapProps
  : N extends 'place_sheet_open'
  ? PlaceSheetOpenProps
  : N extends 'post_view_start'
  ? PostViewStartProps
  : N extends 'post_view_end'
  ? PostViewEndProps
  : N extends 'feed_item_visible'
  ? FeedItemVisibleProps
  : N extends 'like_toggle'
  ? ToggleProps
  : N extends 'save_toggle'
  ? ToggleProps
  : N extends 'error'
  ? ErrorProps
  : N extends 'perf_web_vitals'
  ? PerfWebVitalsProps
  : N extends 'exp_exposure'
  ? ExperimentExposureProps
  : N extends 'app_start'
  ? AppStartProps
  : N extends 'screen_view'
  ? ScreenViewProps
  : Record<string, any>;

export type PinTapProps = {
  place_id: string;
  zoom: number;
  // ⚠️ CRITICAL: Never send exact coordinates (lat/lng)
  // Server derives geohash/rounded coords from place_id if needed
};

export type PlaceSheetOpenProps = {
  place_id: string;
  stage: 'peek' | 'half' | 'full';
};

export type PostViewStartProps = {
  post_id: string;
  place_id?: string;
  source: 'feed' | 'place' | 'map';
};

export type PostViewEndProps = {
  post_id: string;
  dwell_ms: number;
};

export type FeedItemVisibleProps = {
  post_id: string;
  ratio: number;
  visible_ms: number;
};

export type ToggleProps = {
  target: 'post' | 'place';
  id: string;
  active: boolean;
  source: 'feed' | 'place' | 'map';
};

export type ErrorProps = {
  code: string;
  surface: string;
  retryable: boolean;
  message?: string;
};

export type ExperimentExposureProps = {
  exp_key: string;
  variant: string;
};

export type PerfWebVitalsProps = {
  name: string;
  value: number;
  id: string;
};

export type AppStartProps = {
  cold_start: boolean;
};

export type ScreenViewProps = {
  screen_name: string;
  previous_screen?: string;
};

// ============================================================================
// Zod Validation Schemas (Client + Server)
// ============================================================================

const ContextSchema = z.object({
  app_version: z.string(),
  build: z.enum(['web', 'ios', 'android', 'desktop']),
  locale: z.string(),
  timezone: z.string(),
  screen: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    dpr: z.number().positive(),
  }),
  device_id: z.string().uuid(),
  session_id: z.string(),
  user_id: z.string().optional(),
  flags: z.record(z.boolean()).optional(),
  experiments: z.record(z.string()).optional(),
});

const BaseEventSchema = z.object({
  event_id: z.string().uuid().optional(),
  name: z.enum([
    'pin_tap',
    'place_sheet_open',
    'post_view_start',
    'post_view_end',
    'feed_item_visible',
    'like_toggle',
    'save_toggle',
    'error',
    'perf_web_vitals',
    'exp_exposure',
    'app_start',
    'screen_view',
  ]),
  schema_version: z.number().int().default(1),
  ts_client: z.number().int(),
  context: ContextSchema,
});

// Event-specific prop schemas
export const PropSchemas = {
  pin_tap: z.object({
    place_id: z.string(),
    zoom: z.number().int(),
    // ⚠️ NEVER include lat/lng - violates privacy policy
  }),
  place_sheet_open: z.object({
    place_id: z.string(),
    stage: z.enum(['peek', 'half', 'full']),
  }),
  post_view_start: z.object({
    post_id: z.string(),
    place_id: z.string().optional(),
    source: z.enum(['feed', 'place', 'map']),
  }),
  post_view_end: z.object({
    post_id: z.string(),
    dwell_ms: z.number().int().nonnegative(),
  }),
  feed_item_visible: z.object({
    post_id: z.string(),
    ratio: z.number().min(0).max(1),
    visible_ms: z.number().int().nonnegative(),
  }),
  like_toggle: z.object({
    target: z.enum(['post', 'place']),
    id: z.string(),
    active: z.boolean(),
    source: z.enum(['feed', 'place', 'map']),
  }),
  save_toggle: z.object({
    target: z.enum(['post', 'place']),
    id: z.string(),
    active: z.boolean(),
    source: z.enum(['feed', 'place', 'map']),
  }),
  error: z.object({
    code: z.string(),
    surface: z.string(),
    retryable: z.boolean(),
    message: z.string().optional(),
  }),
  perf_web_vitals: z.object({
    name: z.string(),
    value: z.number(),
    id: z.string(),
  }),
  exp_exposure: z.object({
    exp_key: z.string(),
    variant: z.string(),
  }),
  app_start: z.object({
    cold_start: z.boolean(),
  }),
  screen_view: z.object({
    screen_name: z.string(),
    previous_screen: z.string().optional(),
  }),
} as const;

/**
 * Validate event payload (client-side + server-side)
 */
export function validateEvent<N extends EventName>(
  event: Omit<EventPayload<N>, 'props'> & { props: unknown }
): EventPayload<N> {
  // Validate base structure
  const base = BaseEventSchema.parse(event);
  
  // Validate event-specific props
  const propsSchema = PropSchemas[event.name as keyof typeof PropSchemas];
  const validatedProps = propsSchema.parse(event.props);
  
  return {
    ...base,
    props: validatedProps,
  } as EventPayload<N>;
}
