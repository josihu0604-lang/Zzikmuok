import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseServer, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Analytics Collection API
 * 
 * Accepts batch event submissions from client SDK
 * Stores in Supabase (falls back to mock if not configured)
 */

const Context = z.object({
  app_version: z.string(),
  build: z.enum(['web', 'ios', 'android', 'desktop']),
  locale: z.string(),
  timezone: z.string(),
  screen: z.object({
    width: z.number(),
    height: z.number(),
    dpr: z.number(),
  }),
  device_id: z.string(),
  session_id: z.string(),
  user_id: z.string().optional(),
});

const BaseEvent = z.object({
  event_id: z.string().uuid().optional(),
  name: z.string().min(1),
  schema_version: z.number().default(1),
  ts_client: z.number(),
  context: Context,
  props: z.record(z.any()),
});

/**
 * Mock database (in-memory store for development)
 * Replace with actual database query in production
 */
const mockDatabase: any[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const array = Array.isArray(body) ? body : [body];

    // Validate events
    const events = array.map((e) => BaseEvent.parse(e));

    // Extract IP and User-Agent
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
    const ua = req.headers.get('user-agent') ?? undefined;

    // Sanitize and transform for storage
    const rows = events.map((e) => {
      // ⚠️ CRITICAL: Remove PII and exact coordinates (defense in depth)
      const sanitizedProps = { ...e.props };
      const forbiddenKeys = ['lat', 'lng', 'latitude', 'longitude', 'email', 'phone', 'address', 'password'];
      forbiddenKeys.forEach(key => delete sanitizedProps[key]);

      return {
        event_id: e.event_id ?? crypto.randomUUID(),
        name: String(e.name).slice(0, 64), // Limit name length
        user_id: e.context.user_id ?? null,
        session_id: e.context.session_id,
        device_id: e.context.device_id,
        ts_client: new Date(e.ts_client),
        ts_server: new Date(),
        schema_version: e.schema_version,
        context: e.context,
        props: sanitizedProps,
        source: e.context.build,
        ip: ip ?? null,
        ua: ua ?? null,
        partition_day: new Date(e.ts_client).toISOString().slice(0, 10),
      };
    });

    // Use Supabase if configured, otherwise mock
    const supabase = getSupabaseServer();

    if (supabase) {
      // Insert into Supabase
      const { error } = await supabase.from('analytics_events').insert(rows);

      if (error) {
        // Check for duplicate key violation (event_id unique constraint)
        if (error.code === '23505') {
          return NextResponse.json(
            { ok: true, count: rows.length, deduped: true },
            { status: 200 }
          );
        }

        console.error('[Analytics] Insert failed:', error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { ok: true, count: rows.length },
        { status: 200 }
      );
    } else {
      // Fallback to mock database (for development without Supabase)
      const existingIds = new Set(mockDatabase.map((r) => r.event_id));
      const newRows = rows.filter((r) => !existingIds.has(r.event_id));
      
      mockDatabase.push(...newRows);

      if (newRows.length < rows.length) {
        return NextResponse.json(
          { ok: true, count: newRows.length, deduped: rows.length - newRows.length },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { ok: true, count: rows.length, mode: 'mock' },
        { status: 200 }
      );
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  const configured = isSupabaseConfigured();
  const supabase = getSupabaseServer();

  if (supabase) {
    try {
      // Check database connectivity
      const { count, error } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true });

      if (error) {
        return NextResponse.json({
          ok: false,
          mode: 'supabase',
          error: error.message,
        }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        mode: 'supabase',
        count: count ?? 0,
      });
    } catch (err: any) {
      return NextResponse.json({
        ok: false,
        mode: 'supabase',
        error: err?.message ?? 'Unknown error',
      }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    mode: 'mock',
    count: mockDatabase.length,
    message: 'Supabase not configured, using mock mode',
  });
}
