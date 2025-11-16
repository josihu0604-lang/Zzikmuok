-- ============================================================================
-- ZZIK LIVE Analytics - Data Quality (DQ) Monitoring Queries
-- ============================================================================
-- Version: 1.0
-- Created: 2025-11-13
-- Purpose: Continuous data quality monitoring and alerting
--
-- DQ Dimensions:
-- 1. Completeness - Missing required fields
-- 2. Uniqueness - Duplicate events
-- 3. Validity - Value ranges and constraints
-- 4. Timeliness - Ingestion lag
-- 5. Consistency - Cross-event validation
--
-- Alert Thresholds:
-- - Required field missing rate: ≤ 0.5%
-- - Duplicate rate: 0%
-- - Ingestion success rate: ≥ 99%
-- - Client-server time skew: ≤ 60 seconds (p95)
-- ============================================================================

-- ============================================================================
-- 1. COMPLETENESS CHECKS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1.1 Required Field Missing Rate (Last 24 Hours)
-- Purpose: Detect schema drift or client bugs
-- Alert: missing_rate > 0.005 (0.5%)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_required_fields_24h AS
WITH event_checks AS (
  SELECT
    name AS event_name,
    COUNT(*) AS total_events,
    -- Check post_view events
    CASE 
      WHEN name IN ('post_view_start', 'post_view_end')
      THEN COUNT(*) FILTER (WHERE props ? 'post_id')
      ELSE COUNT(*)
    END AS with_post_id,
    -- Check place events
    CASE 
      WHEN name IN ('pin_tap', 'place_sheet_open')
      THEN COUNT(*) FILTER (WHERE props ? 'place_id')
      ELSE COUNT(*)
    END AS with_place_id,
    -- Check session_id (always required)
    COUNT(*) FILTER (WHERE session_id IS NOT NULL) AS with_session_id,
    -- Check device_id (always required)
    COUNT(*) FILTER (WHERE device_id IS NOT NULL) AS with_device_id
  FROM public.analytics_events
  WHERE ts_server >= NOW() - INTERVAL '24 hours'
  GROUP BY name
)
SELECT
  event_name,
  total_events,
  ROUND(1.0 - (with_session_id::NUMERIC / NULLIF(total_events, 0)), 4) AS session_id_missing_rate,
  ROUND(1.0 - (with_device_id::NUMERIC / NULLIF(total_events, 0)), 4) AS device_id_missing_rate,
  ROUND(1.0 - (with_post_id::NUMERIC / NULLIF(total_events, 0)), 4) AS post_id_missing_rate,
  ROUND(1.0 - (with_place_id::NUMERIC / NULLIF(total_events, 0)), 4) AS place_id_missing_rate,
  CASE 
    WHEN (1.0 - (with_session_id::NUMERIC / NULLIF(total_events, 0))) > 0.005 THEN '🔴 CRITICAL'
    WHEN (1.0 - (with_device_id::NUMERIC / NULLIF(total_events, 0))) > 0.005 THEN '🔴 CRITICAL'
    WHEN (1.0 - (with_post_id::NUMERIC / NULLIF(total_events, 0))) > 0.005 THEN '🟡 WARNING'
    ELSE '✅ HEALTHY'
  END AS health_status
FROM event_checks
ORDER BY total_events DESC;

-- ----------------------------------------------------------------------------
-- 1.2 Context Field Completeness
-- Purpose: Monitor context enrichment quality
-- Alert: Any context field missing > 1%
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_context_completeness_24h AS
SELECT
  COUNT(*) AS total_events,
  COUNT(*) FILTER (WHERE context ? 'app_version') AS with_app_version,
  COUNT(*) FILTER (WHERE context ? 'build') AS with_build,
  COUNT(*) FILTER (WHERE context ? 'locale') AS with_locale,
  COUNT(*) FILTER (WHERE context ? 'timezone') AS with_timezone,
  COUNT(*) FILTER (WHERE context ? 'screen') AS with_screen,
  ROUND(100.0 * COUNT(*) FILTER (WHERE context ? 'app_version') / COUNT(*), 2) AS app_version_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE context ? 'build') / COUNT(*), 2) AS build_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE context ? 'locale') / COUNT(*), 2) AS locale_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE context ? 'timezone') / COUNT(*), 2) AS timezone_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE context ? 'screen') / COUNT(*), 2) AS screen_pct
FROM public.analytics_events
WHERE ts_server >= NOW() - INTERVAL '24 hours';

-- ============================================================================
-- 2. UNIQUENESS CHECKS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 Duplicate Event Rate (Last 24 Hours)
-- Purpose: Detect retry storms or client bugs
-- Alert: dup_rate > 0
-- Target: dup_rate = 0 (with unique constraint)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_duplicate_rate_24h AS
WITH events_24h AS (
  SELECT
    event_id,
    name,
    device_id,
    session_id,
    ts_client,
    COUNT(*) OVER (PARTITION BY event_id) AS dup_count
  FROM public.analytics_events
  WHERE ts_server >= NOW() - INTERVAL '24 hours'
    AND event_id IS NOT NULL
)
SELECT
  COUNT(*) AS total_events,
  COUNT(DISTINCT event_id) AS unique_events,
  COUNT(*) - COUNT(DISTINCT event_id) AS duplicate_count,
  ROUND(
    (COUNT(*) - COUNT(DISTINCT event_id))::NUMERIC / NULLIF(COUNT(*), 0),
    4
  ) AS duplicate_rate,
  CASE 
    WHEN COUNT(*) - COUNT(DISTINCT event_id) > 0 THEN '🔴 DUPLICATES_FOUND'
    ELSE '✅ UNIQUE'
  END AS health_status
FROM events_24h;

-- ----------------------------------------------------------------------------
-- 2.2 Session-Level Duplicate Detection
-- Purpose: Find same event sent multiple times in same session
-- Alert: > 10 duplicate clusters per hour
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_session_duplicates_1h AS
WITH recent_events AS (
  SELECT
    name,
    session_id,
    props,
    ts_client,
    COUNT(*) AS occurrence_count
  FROM public.analytics_events
  WHERE ts_server >= NOW() - INTERVAL '1 hour'
  GROUP BY name, session_id, props, ts_client
  HAVING COUNT(*) > 1
)
SELECT
  name AS event_name,
  COUNT(*) AS duplicate_clusters,
  SUM(occurrence_count) AS total_duplicates,
  MAX(occurrence_count) AS max_dup_in_cluster
FROM recent_events
GROUP BY name
ORDER BY duplicate_clusters DESC;

-- ============================================================================
-- 3. VALIDITY CHECKS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 Value Range Validation
-- Purpose: Detect outliers and invalid values
-- Alert: outlier_pct > 1%
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_value_ranges_24h AS
WITH dwell_times AS (
  SELECT
    (props->>'dwell_ms')::INTEGER AS dwell_ms
  FROM public.analytics_events
  WHERE name = 'post_view_end'
    AND ts_server >= NOW() - INTERVAL '24 hours'
    AND props ? 'dwell_ms'
),
visibility_ratios AS (
  SELECT
    (props->>'ratio')::NUMERIC AS ratio
  FROM public.analytics_events
  WHERE name = 'feed_item_visible'
    AND ts_server >= NOW() - INTERVAL '24 hours'
    AND props ? 'ratio'
)
SELECT
  -- Dwell time validation
  (SELECT COUNT(*) FROM dwell_times WHERE dwell_ms < 0) AS negative_dwell_count,
  (SELECT COUNT(*) FROM dwell_times WHERE dwell_ms > 600000) AS excessive_dwell_count_10min,
  (SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_ms < 0 OR dwell_ms > 600000) / NULLIF(COUNT(*), 0), 2) 
   FROM dwell_times) AS dwell_outlier_pct,
  
  -- Visibility ratio validation
  (SELECT COUNT(*) FROM visibility_ratios WHERE ratio < 0 OR ratio > 1) AS invalid_ratio_count,
  (SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE ratio < 0 OR ratio > 1) / NULLIF(COUNT(*), 0), 2)
   FROM visibility_ratios) AS ratio_outlier_pct,
  
  -- Health status
  CASE 
    WHEN (SELECT COUNT(*) FROM dwell_times WHERE dwell_ms < 0) > 0 THEN '🔴 INVALID_DWELL'
    WHEN (SELECT COUNT(*) FROM visibility_ratios WHERE ratio < 0 OR ratio > 1) > 0 THEN '🔴 INVALID_RATIO'
    ELSE '✅ VALID'
  END AS health_status;

-- ----------------------------------------------------------------------------
-- 3.2 Enum Value Validation
-- Purpose: Detect invalid enum values (source, target, stage, etc.)
-- Alert: Any invalid enum value found
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_enum_validation_24h AS
WITH enum_checks AS (
  SELECT
    name,
    props->>'source' AS source_value,
    props->>'target' AS target_value,
    props->>'stage' AS stage_value
  FROM public.analytics_events
  WHERE ts_server >= NOW() - INTERVAL '24 hours'
)
SELECT
  'source' AS enum_field,
  source_value AS invalid_value,
  COUNT(*) AS occurrence_count
FROM enum_checks
WHERE source_value IS NOT NULL
  AND source_value NOT IN ('feed', 'place', 'map', 'search')
GROUP BY source_value

UNION ALL

SELECT
  'target' AS enum_field,
  target_value AS invalid_value,
  COUNT(*) AS occurrence_count
FROM enum_checks
WHERE target_value IS NOT NULL
  AND target_value NOT IN ('post', 'place')
GROUP BY target_value

UNION ALL

SELECT
  'stage' AS enum_field,
  stage_value AS invalid_value,
  COUNT(*) AS occurrence_count
FROM enum_checks
WHERE stage_value IS NOT NULL
  AND stage_value NOT IN ('peek', 'half', 'full')
GROUP BY stage_value

ORDER BY occurrence_count DESC;

-- ============================================================================
-- 4. TIMELINESS CHECKS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 Ingestion Lag (Client → Server)
-- Purpose: Monitor event delivery latency
-- Alert: p95_lag > 60 seconds
-- Target: p95_lag ≤ 5 seconds
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_ingestion_lag_1h AS
WITH lag_data AS (
  SELECT
    name,
    EXTRACT(EPOCH FROM (ts_server - ts_client)) AS lag_seconds
  FROM public.analytics_events
  WHERE ts_server >= NOW() - INTERVAL '1 hour'
    AND ts_client IS NOT NULL
    AND ts_server >= ts_client  -- Filter out clock skew
)
SELECT
  name AS event_name,
  COUNT(*) AS event_count,
  ROUND(AVG(lag_seconds), 2) AS avg_lag_sec,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY lag_seconds), 2) AS p50_lag_sec,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY lag_seconds), 2) AS p95_lag_sec,
  ROUND(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY lag_seconds), 2) AS p99_lag_sec,
  CASE 
    WHEN PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY lag_seconds) > 60 THEN '🔴 HIGH_LAG'
    WHEN PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY lag_seconds) > 10 THEN '🟡 ELEVATED'
    ELSE '✅ HEALTHY'
  END AS health_status
FROM lag_data
GROUP BY name
ORDER BY p95_lag_sec DESC;

-- ----------------------------------------------------------------------------
-- 4.2 Clock Skew Detection
-- Purpose: Detect clients with incorrect system time
-- Alert: skew_count > 100 in 1 hour
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_clock_skew_1h AS
SELECT
  COUNT(*) AS skewed_events,
  COUNT(DISTINCT device_id) AS affected_devices,
  MIN(EXTRACT(EPOCH FROM (ts_server - ts_client))) AS max_past_skew_sec,
  MAX(EXTRACT(EPOCH FROM (ts_server - ts_client))) AS max_future_skew_sec,
  CASE 
    WHEN COUNT(*) > 100 THEN '🔴 HIGH_SKEW'
    WHEN COUNT(*) > 10 THEN '🟡 SOME_SKEW'
    ELSE '✅ HEALTHY'
  END AS health_status
FROM public.analytics_events
WHERE ts_server >= NOW() - INTERVAL '1 hour'
  AND (
    ts_client > ts_server + INTERVAL '60 seconds'  -- Future events
    OR ts_client < ts_server - INTERVAL '300 seconds'  -- Very old events (5min+)
  );

-- ============================================================================
-- 5. CONSISTENCY CHECKS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 Post View Lifecycle Validation
-- Purpose: Ensure post_view_start has matching post_view_end
-- Alert: orphan_rate > 10%
-- Target: orphan_rate ≤ 5% (acceptable for crashes/force quit)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_post_view_lifecycle_24h AS
WITH starts AS (
  SELECT
    session_id,
    props->>'post_id' AS post_id,
    ts_server AS start_time
  FROM public.analytics_events
  WHERE name = 'post_view_start'
    AND ts_server >= NOW() - INTERVAL '24 hours'
),
ends AS (
  SELECT
    session_id,
    props->>'post_id' AS post_id,
    ts_server AS end_time,
    (props->>'dwell_ms')::INTEGER AS dwell_ms
  FROM public.analytics_events
  WHERE name = 'post_view_end'
    AND ts_server >= NOW() - INTERVAL '24 hours'
)
SELECT
  (SELECT COUNT(*) FROM starts) AS total_starts,
  (SELECT COUNT(*) FROM ends) AS total_ends,
  (SELECT COUNT(*) FROM starts s 
   WHERE NOT EXISTS (
     SELECT 1 FROM ends e 
     WHERE e.session_id = s.session_id 
       AND e.post_id = s.post_id
       AND e.end_time > s.start_time
   )) AS orphan_starts,
  ROUND(
    100.0 * (SELECT COUNT(*) FROM starts s 
             WHERE NOT EXISTS (
               SELECT 1 FROM ends e 
               WHERE e.session_id = s.session_id 
                 AND e.post_id = s.post_id
                 AND e.end_time > s.start_time
             )) / NULLIF((SELECT COUNT(*) FROM starts), 0),
    2
  ) AS orphan_rate_pct,
  CASE 
    WHEN ROUND(100.0 * (SELECT COUNT(*) FROM starts s 
                        WHERE NOT EXISTS (
                          SELECT 1 FROM ends e 
                          WHERE e.session_id = s.session_id 
                            AND e.post_id = s.post_id
                            AND e.end_time > s.start_time
                        )) / NULLIF((SELECT COUNT(*) FROM starts), 0), 2) > 10 THEN '🔴 HIGH_ORPHAN'
    WHEN ROUND(100.0 * (SELECT COUNT(*) FROM starts s 
                        WHERE NOT EXISTS (
                          SELECT 1 FROM ends e 
                          WHERE e.session_id = s.session_id 
                            AND e.post_id = s.post_id
                            AND e.end_time > s.start_time
                        )) / NULLIF((SELECT COUNT(*) FROM starts), 0), 2) > 5 THEN '🟡 ACCEPTABLE'
    ELSE '✅ HEALTHY'
  END AS health_status;

-- ----------------------------------------------------------------------------
-- 5.2 Experiment Exposure Balance
-- Purpose: Detect bucketing skew (should match weights ±3%p)
-- Alert: max_deviation > 0.03
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_experiment_balance_24h AS
WITH exposures AS (
  SELECT
    props->>'exp_key' AS exp_key,
    props->>'variant' AS variant,
    COUNT(DISTINCT device_id) AS unique_users
  FROM public.analytics_events
  WHERE name = 'exp_exposure'
    AND ts_server >= NOW() - INTERVAL '24 hours'
  GROUP BY props->>'exp_key', props->>'variant'
),
totals AS (
  SELECT
    exp_key,
    SUM(unique_users) AS total_users
  FROM exposures
  GROUP BY exp_key
)
SELECT
  e.exp_key,
  e.variant,
  e.unique_users,
  t.total_users,
  ROUND(100.0 * e.unique_users / NULLIF(t.total_users, 0), 2) AS variant_pct,
  ABS(ROUND(100.0 * e.unique_users / NULLIF(t.total_users, 0), 2) - 50.0) AS deviation_from_50_50,
  CASE 
    WHEN ABS(ROUND(100.0 * e.unique_users / NULLIF(t.total_users, 0), 2) - 50.0) > 3.0 THEN '🔴 SKEWED'
    WHEN ABS(ROUND(100.0 * e.unique_users / NULLIF(t.total_users, 0), 2) - 50.0) > 1.5 THEN '🟡 SLIGHT_SKEW'
    ELSE '✅ BALANCED'
  END AS balance_status
FROM exposures e
JOIN totals t ON e.exp_key = t.exp_key
ORDER BY e.exp_key, e.variant;

-- ============================================================================
-- 6. OVERALL HEALTH DASHBOARD
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 6.1 Data Quality Summary (Last 24 Hours)
-- Purpose: Single-pane-of-glass health check
-- Refresh: Every 5 minutes
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dq_health_summary AS
SELECT
  NOW() AS last_updated,
  
  -- Event volume
  (SELECT COUNT(*) FROM public.analytics_events 
   WHERE ts_server >= NOW() - INTERVAL '24 hours') AS events_24h,
  (SELECT COUNT(DISTINCT session_id) FROM public.analytics_events 
   WHERE ts_server >= NOW() - INTERVAL '24 hours') AS sessions_24h,
  (SELECT COUNT(DISTINCT device_id) FROM public.analytics_events 
   WHERE ts_server >= NOW() - INTERVAL '24 hours') AS devices_24h,
  
  -- Completeness
  (SELECT MAX(session_id_missing_rate) FROM dq_required_fields_24h) AS max_missing_rate,
  (SELECT CASE WHEN MAX(session_id_missing_rate) > 0.005 THEN '🔴' ELSE '✅' END 
   FROM dq_required_fields_24h) AS completeness_status,
  
  -- Uniqueness
  (SELECT duplicate_rate FROM dq_duplicate_rate_24h) AS duplicate_rate,
  (SELECT CASE WHEN duplicate_rate > 0 THEN '🔴' ELSE '✅' END 
   FROM dq_duplicate_rate_24h) AS uniqueness_status,
  
  -- Timeliness
  (SELECT MAX(p95_lag_sec) FROM dq_ingestion_lag_1h) AS max_p95_lag_sec,
  (SELECT CASE WHEN MAX(p95_lag_sec) > 60 THEN '🔴' WHEN MAX(p95_lag_sec) > 10 THEN '🟡' ELSE '✅' END 
   FROM dq_ingestion_lag_1h) AS timeliness_status,
  
  -- Lifecycle consistency
  (SELECT orphan_rate_pct FROM dq_post_view_lifecycle_24h) AS orphan_rate_pct,
  (SELECT CASE WHEN orphan_rate_pct > 10 THEN '🔴' WHEN orphan_rate_pct > 5 THEN '🟡' ELSE '✅' END 
   FROM dq_post_view_lifecycle_24h) AS lifecycle_status,
  
  -- Overall health
  CASE 
    WHEN EXISTS (SELECT 1 FROM dq_required_fields_24h WHERE health_status LIKE '🔴%')
      OR (SELECT duplicate_rate FROM dq_duplicate_rate_24h) > 0
      OR (SELECT MAX(p95_lag_sec) FROM dq_ingestion_lag_1h) > 60
      OR (SELECT orphan_rate_pct FROM dq_post_view_lifecycle_24h) > 10
    THEN '🔴 CRITICAL_ISSUES'
    WHEN (SELECT MAX(p95_lag_sec) FROM dq_ingestion_lag_1h) > 10
      OR (SELECT orphan_rate_pct FROM dq_post_view_lifecycle_24h) > 5
    THEN '🟡 WARNINGS'
    ELSE '✅ HEALTHY'
  END AS overall_health;

-- ============================================================================
-- USAGE NOTES
-- ============================================================================
--
-- **Setup**:
-- 1. Run this migration to create all DQ views
-- 2. Set up Grafana/Metabase to query these views every 5-15 minutes
-- 3. Configure alerts based on health_status columns
--
-- **Alerting Thresholds** (Recommended):
-- - 🔴 CRITICAL: Page ops immediately, data quality at risk
-- - 🟡 WARNING: Investigate within 1 hour
-- - ✅ HEALTHY: No action needed
--
-- **Key Queries for Monitoring**:
-- ```sql
-- -- Quick health check
-- SELECT * FROM dq_health_summary;
--
-- -- Detailed diagnostics
-- SELECT * FROM dq_required_fields_24h WHERE health_status LIKE '🔴%';
-- SELECT * FROM dq_ingestion_lag_1h WHERE health_status = '🔴 HIGH_LAG';
-- SELECT * FROM dq_experiment_balance_24h WHERE balance_status = '🔴 SKEWED';
-- ```
--
-- **Maintenance**:
-- - Views automatically update on query (no materialization needed)
-- - Consider materialized views if query performance becomes an issue
-- - Refresh interval recommendation: 5 minutes for dashboards
--
-- ============================================================================
