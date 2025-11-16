-- ============================================================================
-- ZZIK LIVE Analytics - Advanced Dashboard Queries
-- ============================================================================
-- Version: 1.0
-- Created: 2025-11-13
-- Purpose: Advanced metrics for operational excellence
--
-- Query Categories:
-- 1. Dwell Time Analysis (Percentiles & Distribution)
-- 2. Experiment Lift Analysis (Variant Comparison)
-- 3. Funnel Drop-off Analysis (Conversion Optimization)
-- 4. Cohort Retention Analysis
-- 5. Power User Identification
-- ============================================================================

-- ============================================================================
-- 1. DWELL TIME ANALYSIS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1.1 Dwell Time Percentiles (7 Days)
-- Purpose: Understand content engagement distribution
-- Metrics: p50, p75, p90, p95, p99
-- Filters: Date range, Source
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dwell_percentiles_7d AS
WITH dwell_data AS (
  SELECT
    DATE(ts_server) AS date,
    props->>'source' AS source,
    (props->>'dwell_ms')::INTEGER AS dwell_ms
  FROM public.analytics_events
  WHERE name = 'post_view_end'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
    AND props ? 'dwell_ms'
    AND (props->>'dwell_ms')::INTEGER >= 0
    AND (props->>'dwell_ms')::INTEGER <= 600000  -- Cap at 10 minutes
)
SELECT
  date,
  source,
  COUNT(*) AS total_views,
  ROUND(AVG(dwell_ms)) AS avg_dwell_ms,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dwell_ms)) AS p50_dwell_ms,
  ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY dwell_ms)) AS p75_dwell_ms,
  ROUND(PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY dwell_ms)) AS p90_dwell_ms,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY dwell_ms)) AS p95_dwell_ms,
  ROUND(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY dwell_ms)) AS p99_dwell_ms,
  COUNT(*) FILTER (WHERE dwell_ms >= 3000) AS engaged_views_3s_plus,
  ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_ms >= 3000) / COUNT(*), 2) AS engagement_rate_pct
FROM dwell_data
GROUP BY date, source
ORDER BY date DESC, source;

COMMENT ON VIEW dwell_percentiles_7d IS 
'Dwell time distribution by source (feed/place/map). 
Engagement threshold: 3+ seconds.
Use for: Content quality assessment, source comparison.';

-- ----------------------------------------------------------------------------
-- 1.2 Dwell Time Buckets (Distribution)
-- Purpose: Visualize dwell time histogram
-- Buckets: <1s, 1-3s, 3-5s, 5-10s, 10-30s, 30s+
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW dwell_distribution_7d AS
WITH dwell_data AS (
  SELECT
    (props->>'dwell_ms')::INTEGER AS dwell_ms
  FROM public.analytics_events
  WHERE name = 'post_view_end'
    AND ts_server >= CURRENT_DATE - INTERVAL '7 days'
    AND props ? 'dwell_ms'
)
SELECT
  COUNT(*) FILTER (WHERE dwell_ms < 1000) AS under_1s,
  COUNT(*) FILTER (WHERE dwell_ms >= 1000 AND dwell_ms < 3000) AS range_1_3s,
  COUNT(*) FILTER (WHERE dwell_ms >= 3000 AND dwell_ms < 5000) AS range_3_5s,
  COUNT(*) FILTER (WHERE dwell_ms >= 5000 AND dwell_ms < 10000) AS range_5_10s,
  COUNT(*) FILTER (WHERE dwell_ms >= 10000 AND dwell_ms < 30000) AS range_10_30s,
  COUNT(*) FILTER (WHERE dwell_ms >= 30000) AS over_30s,
  COUNT(*) AS total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_ms < 1000) / COUNT(*), 2) AS under_1s_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_ms >= 1000 AND dwell_ms < 3000) / COUNT(*), 2) AS range_1_3s_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_ms >= 3000 AND dwell_ms < 5000) / COUNT(*), 2) AS range_3_5s_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_ms >= 5000 AND dwell_ms < 10000) / COUNT(*), 2) AS range_5_10s_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_ms >= 10000 AND dwell_ms < 30000) / COUNT(*), 2) AS range_10_30s_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE dwell_ms >= 30000) / COUNT(*), 2) AS over_30s_pct
FROM dwell_data;

-- ============================================================================
-- 2. EXPERIMENT LIFT ANALYSIS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 2.1 Experiment Lift - Dwell Time (Simple Version)
-- Purpose: Compare median dwell time across variants
-- Metrics: p50, sample size, lift %
-- Filters: Experiment key
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION experiment_dwell_lift(exp_key TEXT, days INTEGER DEFAULT 7)
RETURNS TABLE (
  variant TEXT,
  sample_size BIGINT,
  avg_dwell_ms NUMERIC,
  p50_dwell_ms NUMERIC,
  p75_dwell_ms NUMERIC,
  p90_dwell_ms NUMERIC,
  lift_vs_control_pct NUMERIC
) AS $$
WITH exp_users AS (
  SELECT DISTINCT
    props->>'variant' AS variant,
    device_id
  FROM public.analytics_events
  WHERE name = 'exp_exposure'
    AND props->>'exp_key' = exp_key
    AND ts_server >= CURRENT_DATE - days * INTERVAL '1 day'
),
dwell_data AS (
  SELECT
    eu.variant,
    (e.props->>'dwell_ms')::INTEGER AS dwell_ms
  FROM public.analytics_events e
  JOIN exp_users eu ON e.device_id = eu.device_id
  WHERE e.name = 'post_view_end'
    AND e.ts_server >= CURRENT_DATE - days * INTERVAL '1 day'
    AND e.props ? 'dwell_ms'
),
variant_stats AS (
  SELECT
    variant,
    COUNT(*) AS sample_size,
    ROUND(AVG(dwell_ms), 2) AS avg_dwell_ms,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dwell_ms), 2) AS p50_dwell_ms,
    ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY dwell_ms), 2) AS p75_dwell_ms,
    ROUND(PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY dwell_ms), 2) AS p90_dwell_ms
  FROM dwell_data
  GROUP BY variant
),
control_baseline AS (
  SELECT p50_dwell_ms AS control_p50
  FROM variant_stats
  ORDER BY sample_size DESC
  LIMIT 1
)
SELECT
  vs.variant,
  vs.sample_size,
  vs.avg_dwell_ms,
  vs.p50_dwell_ms,
  vs.p75_dwell_ms,
  vs.p90_dwell_ms,
  ROUND(
    100.0 * (vs.p50_dwell_ms - cb.control_p50) / NULLIF(cb.control_p50, 0),
    2
  ) AS lift_vs_control_pct
FROM variant_stats vs, control_baseline cb
ORDER BY vs.variant;
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION experiment_dwell_lift IS 
'Calculate dwell time lift for experiment variants.
Usage: SELECT * FROM experiment_dwell_lift(''feed_caption_lines'', 7);';

-- ----------------------------------------------------------------------------
-- 2.2 Experiment Lift - Conversion Rate
-- Purpose: Compare action rates (like, save) across variants
-- Metrics: CR, sample size, lift %
-- Filters: Experiment key, Action type
-- Refresh: Hourly
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION experiment_action_lift(
  exp_key TEXT,
  action_name TEXT,  -- 'like_toggle' or 'save_toggle'
  days INTEGER DEFAULT 7
)
RETURNS TABLE (
  variant TEXT,
  impressions BIGINT,
  actions BIGINT,
  action_rate_pct NUMERIC,
  lift_vs_control_pct NUMERIC
) AS $$
WITH exp_users AS (
  SELECT DISTINCT
    props->>'variant' AS variant,
    device_id
  FROM public.analytics_events
  WHERE name = 'exp_exposure'
    AND props->>'exp_key' = exp_key
    AND ts_server >= CURRENT_DATE - days * INTERVAL '1 day'
),
impressions AS (
  SELECT
    eu.variant,
    COUNT(*) AS impression_count
  FROM public.analytics_events e
  JOIN exp_users eu ON e.device_id = eu.device_id
  WHERE e.name = 'post_view_start'
    AND e.ts_server >= CURRENT_DATE - days * INTERVAL '1 day'
  GROUP BY eu.variant
),
actions AS (
  SELECT
    eu.variant,
    COUNT(*) FILTER (WHERE (e.props->>'active')::BOOLEAN = TRUE) AS action_count
  FROM public.analytics_events e
  JOIN exp_users eu ON e.device_id = eu.device_id
  WHERE e.name = action_name
    AND e.props->>'target' = 'post'
    AND e.ts_server >= CURRENT_DATE - days * INTERVAL '1 day'
  GROUP BY eu.variant
),
variant_stats AS (
  SELECT
    i.variant,
    i.impression_count AS impressions,
    COALESCE(a.action_count, 0) AS actions,
    ROUND(
      100.0 * COALESCE(a.action_count, 0) / NULLIF(i.impression_count, 0),
      3
    ) AS action_rate_pct
  FROM impressions i
  LEFT JOIN actions a ON i.variant = a.variant
),
control_baseline AS (
  SELECT action_rate_pct AS control_rate
  FROM variant_stats
  ORDER BY impressions DESC
  LIMIT 1
)
SELECT
  vs.variant,
  vs.impressions,
  vs.actions,
  vs.action_rate_pct,
  ROUND(
    100.0 * (vs.action_rate_pct - cb.control_rate) / NULLIF(cb.control_rate, 0),
    2
  ) AS lift_vs_control_pct
FROM variant_stats vs, control_baseline cb
ORDER BY vs.variant;
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION experiment_action_lift IS 
'Calculate action rate lift for experiment variants.
Usage: SELECT * FROM experiment_action_lift(''feed_caption_lines'', ''like_toggle'', 7);';

-- ============================================================================
-- 3. FUNNEL DROP-OFF ANALYSIS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 Complete User Journey Funnel (7 Days)
-- Purpose: Identify where users drop off
-- Stages: App Start → Map View → Pin Tap → Sheet Open → Post View → Action
-- Refresh: Daily
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW user_journey_funnel_7d AS
WITH session_events AS (
  SELECT
    session_id,
    MAX(CASE WHEN name = 'app_start' THEN 1 ELSE 0 END) AS has_app_start,
    MAX(CASE WHEN name = 'screen_view' AND props->>'screen_name' = 'map' THEN 1 ELSE 0 END) AS has_map_view,
    MAX(CASE WHEN name = 'pin_tap' THEN 1 ELSE 0 END) AS has_pin_tap,
    MAX(CASE WHEN name = 'place_sheet_open' THEN 1 ELSE 0 END) AS has_sheet_open,
    MAX(CASE WHEN name = 'post_view_start' THEN 1 ELSE 0 END) AS has_post_view,
    MAX(CASE WHEN name IN ('like_toggle', 'save_toggle') 
         AND props->>'target' = 'post' 
         AND (props->>'active')::BOOLEAN = TRUE THEN 1 ELSE 0 END) AS has_action
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY session_id
)
SELECT
  SUM(has_app_start) AS stage_1_app_start,
  SUM(has_map_view) AS stage_2_map_view,
  SUM(has_pin_tap) AS stage_3_pin_tap,
  SUM(has_sheet_open) AS stage_4_sheet_open,
  SUM(has_post_view) AS stage_5_post_view,
  SUM(has_action) AS stage_6_action,
  
  -- Conversion rates
  ROUND(100.0 * SUM(has_map_view) / NULLIF(SUM(has_app_start), 0), 2) AS cr_1_to_2_pct,
  ROUND(100.0 * SUM(has_pin_tap) / NULLIF(SUM(has_map_view), 0), 2) AS cr_2_to_3_pct,
  ROUND(100.0 * SUM(has_sheet_open) / NULLIF(SUM(has_pin_tap), 0), 2) AS cr_3_to_4_pct,
  ROUND(100.0 * SUM(has_post_view) / NULLIF(SUM(has_sheet_open), 0), 2) AS cr_4_to_5_pct,
  ROUND(100.0 * SUM(has_action) / NULLIF(SUM(has_post_view), 0), 2) AS cr_5_to_6_pct,
  
  -- Overall conversion
  ROUND(100.0 * SUM(has_action) / NULLIF(SUM(has_app_start), 0), 2) AS overall_cr_pct
FROM session_events;

-- ============================================================================
-- 4. COHORT RETENTION ANALYSIS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 Day-N Retention (Weekly Cohorts)
-- Purpose: Track user retention by install week
-- Metrics: D1, D3, D7, D14, D30 retention
-- Refresh: Daily
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW cohort_retention_weekly AS
WITH first_seen AS (
  SELECT
    device_id,
    DATE_TRUNC('week', MIN(DATE(ts_server))) AS cohort_week,
    MIN(DATE(ts_server)) AS first_date
  FROM public.analytics_events
  WHERE name = 'app_start'
  GROUP BY device_id
),
daily_active AS (
  SELECT DISTINCT
    device_id,
    DATE(ts_server) AS active_date
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '60 days'
),
retention_matrix AS (
  SELECT
    fs.cohort_week,
    COUNT(DISTINCT fs.device_id) AS cohort_size,
    COUNT(DISTINCT CASE WHEN da.active_date = fs.first_date + 1 THEN fs.device_id END) AS d1_retained,
    COUNT(DISTINCT CASE WHEN da.active_date = fs.first_date + 3 THEN fs.device_id END) AS d3_retained,
    COUNT(DISTINCT CASE WHEN da.active_date = fs.first_date + 7 THEN fs.device_id END) AS d7_retained,
    COUNT(DISTINCT CASE WHEN da.active_date = fs.first_date + 14 THEN fs.device_id END) AS d14_retained,
    COUNT(DISTINCT CASE WHEN da.active_date = fs.first_date + 30 THEN fs.device_id END) AS d30_retained
  FROM first_seen fs
  LEFT JOIN daily_active da ON fs.device_id = da.device_id
  WHERE fs.cohort_week >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY fs.cohort_week
)
SELECT
  cohort_week,
  cohort_size,
  d1_retained,
  d3_retained,
  d7_retained,
  d14_retained,
  d30_retained,
  ROUND(100.0 * d1_retained / NULLIF(cohort_size, 0), 2) AS d1_retention_pct,
  ROUND(100.0 * d3_retained / NULLIF(cohort_size, 0), 2) AS d3_retention_pct,
  ROUND(100.0 * d7_retained / NULLIF(cohort_size, 0), 2) AS d7_retention_pct,
  ROUND(100.0 * d14_retained / NULLIF(cohort_size, 0), 2) AS d14_retention_pct,
  ROUND(100.0 * d30_retained / NULLIF(cohort_size, 0), 2) AS d30_retention_pct
FROM retention_matrix
ORDER BY cohort_week DESC;

-- ============================================================================
-- 5. POWER USER IDENTIFICATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 Power User Segments (Last 30 Days)
-- Purpose: Identify and segment highly engaged users
-- Segments: Casual, Regular, Power, Super
-- Criteria: Sessions, Dwell time, Actions
-- Refresh: Daily
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW power_user_segments_30d AS
WITH user_activity AS (
  SELECT
    device_id,
    COUNT(DISTINCT session_id) AS session_count,
    COUNT(*) FILTER (WHERE name = 'post_view_end') AS posts_viewed,
    COALESCE(SUM((props->>'dwell_ms')::INTEGER), 0) / 1000 AS total_dwell_sec,
    COUNT(*) FILTER (WHERE name IN ('like_toggle', 'save_toggle') 
                     AND props->>'target' = 'post'
                     AND (props->>'active')::BOOLEAN = TRUE) AS actions_count
  FROM public.analytics_events
  WHERE ts_server >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY device_id
),
segmented AS (
  SELECT
    device_id,
    session_count,
    posts_viewed,
    total_dwell_sec,
    actions_count,
    CASE 
      WHEN session_count >= 20 AND posts_viewed >= 100 AND actions_count >= 50 THEN 'Super'
      WHEN session_count >= 10 AND posts_viewed >= 50 AND actions_count >= 20 THEN 'Power'
      WHEN session_count >= 5 AND posts_viewed >= 20 AND actions_count >= 5 THEN 'Regular'
      ELSE 'Casual'
    END AS segment
  FROM user_activity
)
SELECT
  segment,
  COUNT(*) AS user_count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS user_pct,
  ROUND(AVG(session_count), 1) AS avg_sessions,
  ROUND(AVG(posts_viewed), 1) AS avg_posts_viewed,
  ROUND(AVG(total_dwell_sec), 0) AS avg_dwell_sec,
  ROUND(AVG(actions_count), 1) AS avg_actions
FROM segmented
GROUP BY segment
ORDER BY 
  CASE segment 
    WHEN 'Super' THEN 1
    WHEN 'Power' THEN 2
    WHEN 'Regular' THEN 3
    WHEN 'Casual' THEN 4
  END;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================
--
-- **Dwell Time Analysis**:
-- SELECT * FROM dwell_percentiles_7d WHERE source = 'feed';
-- SELECT * FROM dwell_distribution_7d;
--
-- **Experiment Analysis**:
-- SELECT * FROM experiment_dwell_lift('feed_caption_lines', 7);
-- SELECT * FROM experiment_action_lift('feed_caption_lines', 'like_toggle', 7);
--
-- **Funnel Optimization**:
-- SELECT * FROM user_journey_funnel_7d;
--
-- **Retention & Segmentation**:
-- SELECT * FROM cohort_retention_weekly;
-- SELECT * FROM power_user_segments_30d;
--
-- ============================================================================
