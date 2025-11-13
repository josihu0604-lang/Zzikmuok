-- ============================================================================
-- Analytics Hardening Migration
-- ============================================================================
-- 
-- Adds critical constraints and indexes for production safety:
-- 1. Unique event_id constraint (deduplication)
-- 2. Server timestamp enforcement
-- 3. Partition day for future time-series optimization
-- 4. Performance indexes
--
-- Run after: 2025_analytics.sql
-- ============================================================================

-- Add server timestamp if not exists (with default)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'analytics_events' AND column_name = 'ts_server'
  ) THEN
    ALTER TABLE public.analytics_events 
      ADD COLUMN ts_server TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- Add partition day for future time-series partitioning
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analytics_events' AND column_name = 'partition_day'
  ) THEN
    ALTER TABLE public.analytics_events
      ADD COLUMN partition_day DATE;
  END IF;
END $$;

-- Update partition_day from existing ts_server
UPDATE public.analytics_events
SET partition_day = DATE(ts_server)
WHERE partition_day IS NULL;

-- Create unique index on event_id (if not null)
-- Allows deduplication while supporting null values from legacy data
DROP INDEX IF EXISTS analytics_event_id_uq;
CREATE UNIQUE INDEX analytics_event_id_uq 
  ON public.analytics_events(event_id)
  WHERE event_id IS NOT NULL;

-- Composite index for common query pattern (name + time range)
DROP INDEX IF EXISTS analytics_events_name_ts;
CREATE INDEX analytics_events_name_ts 
  ON public.analytics_events(name, ts_server DESC);

-- Index for partition-aware queries
DROP INDEX IF EXISTS analytics_events_partition_ts;
CREATE INDEX analytics_events_partition_ts
  ON public.analytics_events(partition_day, ts_server DESC);

-- Index for user/session analysis
DROP INDEX IF EXISTS analytics_events_user_session;
CREATE INDEX analytics_events_user_session
  ON public.analytics_events(user_id, session_id, ts_server DESC)
  WHERE user_id IS NOT NULL;

-- Comments
COMMENT ON COLUMN public.analytics_events.ts_server IS 
  'Server-side timestamp (authoritative for analysis)';
COMMENT ON COLUMN public.analytics_events.partition_day IS 
  'Date partition key for time-series optimization';
COMMENT ON INDEX analytics_event_id_uq IS 
  'Ensures event deduplication via client-generated UUID';

-- ============================================================================
-- Data Quality Views
-- ============================================================================

-- Daily event health metrics
CREATE OR REPLACE VIEW analytics_event_health AS
SELECT
  DATE(ts_server) AS date,
  COUNT(*) AS total_events,
  COUNT(DISTINCT session_id) AS unique_sessions,
  COUNT(DISTINCT device_id) AS unique_devices,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) AS unique_users,
  COUNT(*) FILTER (WHERE name = 'screen_view') AS screen_views,
  ROUND(
    COUNT(*)::NUMERIC / NULLIF(COUNT(*) FILTER (WHERE name = 'screen_view'), 0),
    2
  ) AS events_per_screen,
  COUNT(*) FILTER (WHERE name = 'error') AS error_count,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE name = 'error')::NUMERIC / COUNT(*),
    2
  ) AS error_rate_pct
FROM public.analytics_events
WHERE ts_server >= NOW() - INTERVAL '30 days'
GROUP BY DATE(ts_server)
ORDER BY DATE(ts_server) DESC;

COMMENT ON VIEW analytics_event_health IS 
  'Daily health metrics for monitoring data quality and collection rates';

-- ============================================================================
-- Retention Policy (Optional)
-- ============================================================================

-- Example: Delete events older than 180 days
-- Uncomment and schedule via pg_cron or external scheduler
--
-- DELETE FROM public.analytics_events
-- WHERE ts_server < NOW() - INTERVAL '180 days';

-- ============================================================================
-- Grants (Adjust based on your RLS setup)
-- ============================================================================

-- Grant read access to analytics role (if using RLS)
-- GRANT SELECT ON public.analytics_events TO analytics_reader;
-- GRANT SELECT ON analytics_event_health TO analytics_reader;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Run these after migration to verify:

-- 1. Check unique constraint
-- SELECT COUNT(*), COUNT(DISTINCT event_id) 
-- FROM public.analytics_events 
-- WHERE event_id IS NOT NULL;

-- 2. Check index usage
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE tablename = 'analytics_events'
-- ORDER BY idx_scan DESC;

-- 3. Check health metrics
-- SELECT * FROM analytics_event_health LIMIT 7;
