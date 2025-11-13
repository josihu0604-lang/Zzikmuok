-- ============================================================================
-- ZZIK LIVE Analytics Dashboard Queries
-- ============================================================================
-- Version: 1.0
-- Updated: 2025-11-13
-- Purpose: Production-ready SQL for Metabase/Grafana dashboards
--
-- Query Categories:
-- 1. Engagement & Retention (7 queries)
-- 2. Performance & Health (3 queries)
-- 3. Experiments & A/B Testing (4 queries)
--
-- Total: 14 dashboard queries
-- ============================================================================

-- ============================================================================
-- CATEGORY 1: ENGAGEMENT & RETENTION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1.1 Daily Active Users (DAU) Trend
-- Purpose: Track daily unique users over time
-- Metrics: DAU, New Users, Returning Users
-- Filters: Date range, Platform
-- Refresh: Daily
-- ----------------------------------------------------------------------------
WITH daily_users AS (
  SELECT
    DATE(ts_server) AS date,
    device_id,
    MIN(ts_server) AS first_seen_ever
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY DATE(ts_server), device_id
),
global_first_seen AS (
  SELECT
    device_id,
    MIN(DATE(ts_server)) AS first_date
  FROM public.analytics_events
  GROUP BY device_id
)
SELECT
  du.date,
  COUNT(DISTINCT du.device_id) AS dau,
  COUNT(DISTINCT du.device_id) FILTER (
    WHERE gfs.first_date = du.date
  ) AS new_users,
  COUNT(DISTINCT du.device_id) FILTER (
    WHERE gfs.first_date < du.date
  ) AS returning_users
FROM daily_users du
JOIN global_first_seen gfs ON du.device_id = gfs.device_id
GROUP BY du.date
ORDER BY du.date DESC;

-- ----------------------------------------------------------------------------
-- 1.2 Map Engagement Funnel
-- Purpose: Conversion from map view → pin tap → sheet open → post view
-- Metrics: Drop-off rates at each stage
-- Filters: Date range, Zoom level
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH funnel_base AS (
  SELECT
    DATE(ts_server) AS date,
    COUNT(*) FILTER (WHERE name = 'screen_view' AND props->>'screen_name' = 'map') AS map_views,
    COUNT(*) FILTER (WHERE name = 'pin_tap') AS pin_taps,
    COUNT(*) FILTER (WHERE name = 'place_sheet_open') AS sheet_opens,
    COUNT(*) FILTER (WHERE name = 'post_view_start') AS post_views
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE(ts_server)
)
SELECT
  date,
  map_views,
  pin_taps,
  ROUND(100.0 * pin_taps / NULLIF(map_views, 0), 2) AS pin_tap_rate,
  sheet_opens,
  ROUND(100.0 * sheet_opens / NULLIF(pin_taps, 0), 2) AS sheet_open_rate,
  post_views,
  ROUND(100.0 * post_views / NULLIF(sheet_opens, 0), 2) AS post_view_rate,
  ROUND(100.0 * post_views / NULLIF(map_views, 0), 2) AS overall_conversion
FROM funnel_base
ORDER BY date DESC;

-- ----------------------------------------------------------------------------
-- 1.3 Post View Dwell Time Distribution
-- Purpose: Analyze how long users spend viewing posts
-- Metrics: Percentiles (p50, p75, p90, p95), Average, Count
-- Filters: Date range, Source (feed/place/map)
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH view_sessions AS (
  SELECT
    DATE(ts_server) AS date,
    props->>'post_id' AS post_id,
    (props->>'dwell_ms')::INTEGER AS dwell_ms
  FROM public.analytics_events
  WHERE name = 'post_view_end'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
    AND props->>'dwell_ms' IS NOT NULL
)
SELECT
  date,
  COUNT(*) AS total_views,
  ROUND(AVG(dwell_ms)) AS avg_dwell_ms,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dwell_ms) AS p50_dwell_ms,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY dwell_ms) AS p75_dwell_ms,
  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY dwell_ms) AS p90_dwell_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY dwell_ms) AS p95_dwell_ms,
  COUNT(*) FILTER (WHERE dwell_ms >= 3000) AS engaged_views_3s_plus,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE dwell_ms >= 3000) / COUNT(*),
    2
  ) AS engagement_rate
FROM view_sessions
GROUP BY date
ORDER BY date DESC;

-- ----------------------------------------------------------------------------
-- 1.4 Feed Item Visibility & Scroll Depth
-- Purpose: Track which posts are seen and for how long
-- Metrics: Impressions, Visible time, Scroll depth
-- Filters: Date range, Post ID
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH feed_visibility AS (
  SELECT
    DATE(ts_server) AS date,
    props->>'post_id' AS post_id,
    (props->>'ratio')::NUMERIC AS visibility_ratio,
    (props->>'visible_ms')::INTEGER AS visible_ms
  FROM public.analytics_events
  WHERE name = 'feed_item_visible'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
)
SELECT
  date,
  post_id,
  COUNT(*) AS impressions,
  ROUND(AVG(visibility_ratio), 2) AS avg_visibility_ratio,
  ROUND(AVG(visible_ms)) AS avg_visible_ms,
  COUNT(*) FILTER (WHERE visibility_ratio >= 0.5) AS half_visible_count,
  COUNT(*) FILTER (WHERE visible_ms >= 1000) AS viewed_1s_plus
FROM feed_visibility
GROUP BY date, post_id
HAVING COUNT(*) >= 10  -- Minimum threshold for significance
ORDER BY date DESC, impressions DESC;

-- ----------------------------------------------------------------------------
-- 1.5 Engagement Actions (Like/Save) Rates
-- Purpose: Track like and save rates per post
-- Metrics: Total actions, Unique users, Rate per impression
-- Filters: Date range, Post ID, Source
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH post_impressions AS (
  SELECT
    DATE(ts_server) AS date,
    props->>'post_id' AS post_id,
    COUNT(DISTINCT device_id) AS unique_viewers
  FROM public.analytics_events
  WHERE name = 'post_view_start'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE(ts_server), props->>'post_id'
),
post_actions AS (
  SELECT
    DATE(ts_server) AS date,
    props->>'id' AS post_id,
    name AS action_type,
    COUNT(*) FILTER (WHERE (props->>'active')::BOOLEAN = TRUE) AS activations,
    COUNT(*) FILTER (WHERE (props->>'active')::BOOLEAN = FALSE) AS deactivations,
    COUNT(DISTINCT device_id) AS unique_actors
  FROM public.analytics_events
  WHERE name IN ('like_toggle', 'save_toggle')
    AND props->>'target' = 'post'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE(ts_server), props->>'id', name
)
SELECT
  COALESCE(pi.date, pa.date) AS date,
  COALESCE(pi.post_id, pa.post_id) AS post_id,
  pi.unique_viewers,
  pa.action_type,
  pa.activations,
  pa.deactivations,
  pa.unique_actors,
  ROUND(
    100.0 * pa.unique_actors / NULLIF(pi.unique_viewers, 0),
    2
  ) AS action_rate_pct
FROM post_impressions pi
FULL OUTER JOIN post_actions pa
  ON pi.date = pa.date AND pi.post_id = pa.post_id
ORDER BY date DESC, unique_viewers DESC NULLS LAST;

-- ----------------------------------------------------------------------------
-- 1.6 Session Duration & Events per Session
-- Purpose: Analyze session depth and engagement
-- Metrics: Sessions, Events per session, Duration
-- Filters: Date range, Platform
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH session_metrics AS (
  SELECT
    DATE(ts_server) AS date,
    session_id,
    COUNT(*) AS events_in_session,
    EXTRACT(EPOCH FROM (MAX(ts_server) - MIN(ts_server))) AS duration_sec,
    context->>'build' AS platform
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE(ts_server), session_id, context->>'build'
)
SELECT
  date,
  platform,
  COUNT(DISTINCT session_id) AS total_sessions,
  ROUND(AVG(events_in_session), 1) AS avg_events_per_session,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY events_in_session) AS p50_events,
  ROUND(AVG(duration_sec), 1) AS avg_duration_sec,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_sec) AS p50_duration_sec,
  COUNT(*) FILTER (WHERE events_in_session >= 10) AS engaged_sessions_10_plus,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE events_in_session >= 10) / COUNT(*),
    2
  ) AS engagement_rate_pct
FROM session_metrics
GROUP BY date, platform
ORDER BY date DESC, platform;

-- ----------------------------------------------------------------------------
-- 1.7 Place Sheet Engagement Stages
-- Purpose: Track how users interact with place sheet (peek → half → full)
-- Metrics: Stage progression, Bounce rates
-- Filters: Date range, Place ID
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH sheet_opens AS (
  SELECT
    DATE(ts_server) AS date,
    props->>'place_id' AS place_id,
    props->>'stage' AS stage,
    session_id,
    ts_server
  FROM public.analytics_events
  WHERE name = 'place_sheet_open'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
),
stage_progression AS (
  SELECT
    date,
    place_id,
    session_id,
    MAX(CASE WHEN stage = 'peek' THEN 1 ELSE 0 END) AS reached_peek,
    MAX(CASE WHEN stage = 'half' THEN 1 ELSE 0 END) AS reached_half,
    MAX(CASE WHEN stage = 'full' THEN 1 ELSE 0 END) AS reached_full
  FROM sheet_opens
  GROUP BY date, place_id, session_id
)
SELECT
  date,
  place_id,
  COUNT(*) AS total_sessions,
  SUM(reached_peek) AS peek_count,
  SUM(reached_half) AS half_count,
  SUM(reached_full) AS full_count,
  ROUND(100.0 * SUM(reached_half) / NULLIF(SUM(reached_peek), 0), 2) AS peek_to_half_pct,
  ROUND(100.0 * SUM(reached_full) / NULLIF(SUM(reached_half), 0), 2) AS half_to_full_pct,
  ROUND(100.0 * SUM(reached_full) / NULLIF(SUM(reached_peek), 0), 2) AS overall_conversion_pct
FROM stage_progression
GROUP BY date, place_id
HAVING COUNT(*) >= 5  -- Minimum threshold
ORDER BY date DESC, total_sessions DESC;

-- ============================================================================
-- CATEGORY 2: PERFORMANCE & HEALTH
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 Web Vitals Performance Monitoring
-- Purpose: Track Core Web Vitals (CLS, LCP, INP, FCP, TTFB)
-- Metrics: Percentiles, Good/Needs Improvement/Poor classification
-- Filters: Date range, Page
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH vitals AS (
  SELECT
    DATE(ts_server) AS date,
    props->>'name' AS metric_name,
    (props->>'value')::NUMERIC AS value
  FROM public.analytics_events
  WHERE name = 'perf_web_vitals'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
)
SELECT
  date,
  metric_name,
  COUNT(*) AS sample_count,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value), 2) AS p50,
  ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value), 2) AS p75,
  ROUND(PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY value), 2) AS p90,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY value), 2) AS p95,
  -- Web Vitals thresholds (Google recommendations)
  CASE metric_name
    WHEN 'CLS' THEN ROUND(100.0 * COUNT(*) FILTER (WHERE value <= 0.1) / COUNT(*), 2)
    WHEN 'LCP' THEN ROUND(100.0 * COUNT(*) FILTER (WHERE value <= 2500) / COUNT(*), 2)
    WHEN 'INP' THEN ROUND(100.0 * COUNT(*) FILTER (WHERE value <= 200) / COUNT(*), 2)
    WHEN 'FCP' THEN ROUND(100.0 * COUNT(*) FILTER (WHERE value <= 1800) / COUNT(*), 2)
    WHEN 'TTFB' THEN ROUND(100.0 * COUNT(*) FILTER (WHERE value <= 800) / COUNT(*), 2)
    ELSE NULL
  END AS good_pct
FROM vitals
GROUP BY date, metric_name
ORDER BY date DESC, metric_name;

-- ----------------------------------------------------------------------------
-- 2.2 Error Rate & Error Types
-- Purpose: Monitor application errors and crashes
-- Metrics: Error count, Rate, Top error codes
-- Filters: Date range, Surface, Retryable
-- Refresh: Real-time (5 min)
-- ----------------------------------------------------------------------------
WITH daily_errors AS (
  SELECT
    DATE(ts_server) AS date,
    props->>'code' AS error_code,
    props->>'surface' AS surface,
    (props->>'retryable')::BOOLEAN AS retryable,
    COUNT(*) AS error_count,
    COUNT(DISTINCT session_id) AS affected_sessions
  FROM public.analytics_events
  WHERE name = 'error'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE(ts_server), props->>'code', props->>'surface', (props->>'retryable')::BOOLEAN
),
daily_totals AS (
  SELECT
    DATE(ts_server) AS date,
    COUNT(*) AS total_events,
    COUNT(DISTINCT session_id) AS total_sessions
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE(ts_server)
)
SELECT
  de.date,
  de.error_code,
  de.surface,
  de.retryable,
  de.error_count,
  de.affected_sessions,
  ROUND(100.0 * de.error_count / NULLIF(dt.total_events, 0), 4) AS error_rate_pct,
  ROUND(100.0 * de.affected_sessions / NULLIF(dt.total_sessions, 0), 2) AS session_impact_pct
FROM daily_errors de
JOIN daily_totals dt ON de.date = dt.date
ORDER BY de.date DESC, de.error_count DESC;

-- ----------------------------------------------------------------------------
-- 2.3 Analytics Pipeline Health
-- Purpose: Monitor analytics system itself (sample rates, latency, volume)
-- Metrics: Event volume, Client-server latency, Batch sizes
-- Filters: Date range, Event name
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH event_health AS (
  SELECT
    DATE(ts_server) AS date,
    name AS event_name,
    COUNT(*) AS event_count,
    COUNT(DISTINCT device_id) AS unique_devices,
    COUNT(DISTINCT session_id) AS unique_sessions,
    ROUND(AVG(EXTRACT(EPOCH FROM (ts_server - ts_client))), 2) AS avg_latency_sec,
    PERCENTILE_CONT(0.95) WITHIN GROUP (
      ORDER BY EXTRACT(EPOCH FROM (ts_server - ts_client))
    ) AS p95_latency_sec
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY DATE(ts_server), name
)
SELECT
  date,
  event_name,
  event_count,
  unique_devices,
  unique_sessions,
  avg_latency_sec,
  p95_latency_sec,
  -- Flag anomalies
  CASE
    WHEN avg_latency_sec > 5 THEN 'HIGH_LATENCY'
    WHEN event_count = 0 THEN 'NO_EVENTS'
    ELSE 'HEALTHY'
  END AS health_status
FROM event_health
ORDER BY date DESC, event_count DESC;

-- ============================================================================
-- CATEGORY 3: EXPERIMENTS & A/B TESTING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 Experiment Exposure & Bucketing Balance
-- Purpose: Verify experiment bucketing and exposure tracking
-- Metrics: Users per variant, Exposure count, Balance ratio
-- Filters: Experiment key
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH exposures AS (
  SELECT
    props->>'exp_key' AS exp_key,
    props->>'variant' AS variant,
    device_id,
    MIN(ts_server) AS first_exposure
  FROM public.analytics_events
  WHERE name = 'exp_exposure'
    AND ts_server >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY props->>'exp_key', props->>'variant', device_id
)
SELECT
  exp_key,
  variant,
  COUNT(DISTINCT device_id) AS unique_users,
  COUNT(*) AS total_exposures,
  MIN(first_exposure) AS first_seen,
  MAX(first_exposure) AS last_seen,
  -- Check bucketing balance (should be close to expected weights)
  ROUND(
    100.0 * COUNT(DISTINCT device_id) / 
    SUM(COUNT(DISTINCT device_id)) OVER (PARTITION BY exp_key),
    2
  ) AS variant_pct
FROM exposures
GROUP BY exp_key, variant
ORDER BY exp_key, variant;

-- ----------------------------------------------------------------------------
-- 3.2 Experiment Impact - Post View Engagement
-- Purpose: Compare post_view_end dwell time across experiment variants
-- Metrics: Dwell time percentiles, Engagement rate
-- Filters: Experiment key, Date range
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH experiment_users AS (
  SELECT DISTINCT
    props->>'exp_key' AS exp_key,
    props->>'variant' AS variant,
    device_id
  FROM public.analytics_events
  WHERE name = 'exp_exposure'
    AND props->>'exp_key' = 'feed_caption_lines'  -- Replace with experiment key
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
),
post_views AS (
  SELECT
    eu.exp_key,
    eu.variant,
    (e.props->>'dwell_ms')::INTEGER AS dwell_ms
  FROM public.analytics_events e
  JOIN experiment_users eu ON e.device_id = eu.device_id
  WHERE e.name = 'post_view_end'
    AND e.ts_server >= CURRENT_DATE - INTERVAL '7 days'
    AND e.props->>'dwell_ms' IS NOT NULL
)
SELECT
  exp_key,
  variant,
  COUNT(*) AS total_views,
  ROUND(AVG(dwell_ms)) AS avg_dwell_ms,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dwell_ms) AS p50_dwell_ms,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY dwell_ms) AS p75_dwell_ms,
  COUNT(*) FILTER (WHERE dwell_ms >= 3000) AS engaged_views_3s_plus,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE dwell_ms >= 3000) / COUNT(*),
    2
  ) AS engagement_rate_pct,
  -- Statistical significance placeholder (implement with statistical test)
  NULL AS p_value
FROM post_views
GROUP BY exp_key, variant
ORDER BY exp_key, variant;

-- ----------------------------------------------------------------------------
-- 3.3 Experiment Impact - Like & Save Rates
-- Purpose: Compare engagement actions across experiment variants
-- Metrics: Action rates per variant
-- Filters: Experiment key, Date range
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH experiment_users AS (
  SELECT DISTINCT
    props->>'exp_key' AS exp_key,
    props->>'variant' AS variant,
    device_id
  FROM public.analytics_events
  WHERE name = 'exp_exposure'
    AND props->>'exp_key' = 'feed_caption_lines'  -- Replace with experiment key
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
),
post_impressions AS (
  SELECT
    eu.exp_key,
    eu.variant,
    COUNT(*) AS total_impressions,
    COUNT(DISTINCT e.device_id) AS unique_viewers
  FROM public.analytics_events e
  JOIN experiment_users eu ON e.device_id = eu.device_id
  WHERE e.name = 'post_view_start'
    AND e.ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY eu.exp_key, eu.variant
),
engagement_actions AS (
  SELECT
    eu.exp_key,
    eu.variant,
    e.name AS action_type,
    COUNT(*) FILTER (WHERE (e.props->>'active')::BOOLEAN = TRUE) AS activations,
    COUNT(DISTINCT e.device_id) AS unique_actors
  FROM public.analytics_events e
  JOIN experiment_users eu ON e.device_id = eu.device_id
  WHERE e.name IN ('like_toggle', 'save_toggle')
    AND e.props->>'target' = 'post'
    AND e.ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY eu.exp_key, eu.variant, e.name
)
SELECT
  pi.exp_key,
  pi.variant,
  pi.total_impressions,
  pi.unique_viewers,
  ea.action_type,
  ea.activations,
  ea.unique_actors,
  ROUND(100.0 * ea.unique_actors / NULLIF(pi.unique_viewers, 0), 2) AS action_rate_pct,
  -- Lift vs control (manual calculation or use window function)
  ROUND(
    100.0 * (
      (100.0 * ea.unique_actors / NULLIF(pi.unique_viewers, 0)) - 
      FIRST_VALUE(100.0 * ea.unique_actors / NULLIF(pi.unique_viewers, 0)) 
        OVER (PARTITION BY pi.exp_key, ea.action_type ORDER BY pi.variant)
    ) / NULLIF(
      FIRST_VALUE(100.0 * ea.unique_actors / NULLIF(pi.unique_viewers, 0)) 
        OVER (PARTITION BY pi.exp_key, ea.action_type ORDER BY pi.variant),
      0
    ),
    2
  ) AS lift_pct
FROM post_impressions pi
JOIN engagement_actions ea ON pi.exp_key = ea.exp_key AND pi.variant = ea.variant
ORDER BY pi.exp_key, pi.variant, ea.action_type;

-- ----------------------------------------------------------------------------
-- 3.4 Experiment Guardrail Metrics
-- Purpose: Monitor for negative side effects (error rates, performance)
-- Metrics: Error rate, Session duration, Page load times per variant
-- Filters: Experiment key, Date range
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
WITH experiment_users AS (
  SELECT DISTINCT
    props->>'exp_key' AS exp_key,
    props->>'variant' AS variant,
    device_id
  FROM public.analytics_events
  WHERE name = 'exp_exposure'
    AND props->>'exp_key' = 'feed_caption_lines'  -- Replace with experiment key
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
),
error_metrics AS (
  SELECT
    eu.exp_key,
    eu.variant,
    COUNT(*) FILTER (WHERE e.name = 'error') AS error_count,
    COUNT(*) AS total_events,
    ROUND(100.0 * COUNT(*) FILTER (WHERE e.name = 'error') / NULLIF(COUNT(*), 0), 4) AS error_rate_pct
  FROM public.analytics_events e
  JOIN experiment_users eu ON e.device_id = eu.device_id
  WHERE e.ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY eu.exp_key, eu.variant
),
session_metrics AS (
  SELECT
    eu.exp_key,
    eu.variant,
    COUNT(DISTINCT e.session_id) AS total_sessions,
    ROUND(AVG(
      EXTRACT(EPOCH FROM (
        MAX(e.ts_server) OVER (PARTITION BY e.session_id) - 
        MIN(e.ts_server) OVER (PARTITION BY e.session_id)
      ))
    ), 1) AS avg_session_duration_sec
  FROM public.analytics_events e
  JOIN experiment_users eu ON e.device_id = eu.device_id
  WHERE e.ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY eu.exp_key, eu.variant
),
perf_metrics AS (
  SELECT
    eu.exp_key,
    eu.variant,
    ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (
      ORDER BY (e.props->>'value')::NUMERIC
    ), 2) AS p75_lcp
  FROM public.analytics_events e
  JOIN experiment_users eu ON e.device_id = eu.device_id
  WHERE e.name = 'perf_web_vitals'
    AND e.props->>'name' = 'LCP'
    AND e.ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY eu.exp_key, eu.variant
)
SELECT
  em.exp_key,
  em.variant,
  em.error_count,
  em.total_events,
  em.error_rate_pct,
  sm.total_sessions,
  sm.avg_session_duration_sec,
  pm.p75_lcp,
  -- Flag if guardrails violated
  CASE
    WHEN em.error_rate_pct > 1.0 THEN 'HIGH_ERROR_RATE'
    WHEN pm.p75_lcp > 3000 THEN 'SLOW_LCP'
    ELSE 'HEALTHY'
  END AS guardrail_status
FROM error_metrics em
JOIN session_metrics sm ON em.exp_key = sm.exp_key AND em.variant = sm.variant
LEFT JOIN perf_metrics pm ON em.exp_key = pm.exp_key AND em.variant = pm.variant
ORDER BY em.exp_key, em.variant;

-- ============================================================================
-- END OF QUERIES
-- ============================================================================

-- ============================================================================
-- USAGE NOTES
-- ============================================================================
-- 
-- 1. Replace placeholder experiment keys ('feed_caption_lines') with actual keys
-- 2. Adjust date ranges based on dashboard requirements
-- 3. Add indexes for frequently queried columns:
--    - CREATE INDEX idx_events_name_ts ON analytics_events(name, ts_server DESC);
--    - CREATE INDEX idx_events_props_gin ON analytics_events USING GIN(props);
-- 4. Consider materialized views for expensive queries (refresh every 1-6 hours)
-- 5. Set up alerts on error_rate_pct and health_status thresholds
-- 6. For statistical significance, integrate with external tools (e.g., Python scipy)
-- 
-- ============================================================================
