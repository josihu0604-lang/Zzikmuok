-- Analytics Events Table
-- Stores all user interaction events for analysis

create extension if not exists "uuid-ossp";

create table if not exists public.analytics_events (
  event_id uuid primary key default uuid_generate_v4(),
  name text not null,
  user_id text,
  session_id text not null,
  device_id text not null,
  ts_client timestamptz not null,
  ts_server timestamptz not null default now(),
  schema_version int not null default 1,
  context jsonb not null,
  props jsonb not null,
  source text not null default 'web',
  ip inet,
  ua text
);

-- Indexes for performance
create index if not exists analytics_events_name_idx on public.analytics_events(name);
create index if not exists analytics_events_user_idx on public.analytics_events(user_id);
create index if not exists analytics_events_ts_idx on public.analytics_events(ts_server);
create index if not exists analytics_events_session_idx on public.analytics_events(session_id);
create index if not exists analytics_events_device_idx on public.analytics_events(device_id);

-- Unique index for deduplication
create unique index if not exists analytics_events_event_id_idx 
  on public.analytics_events(event_id);

-- GIN index for JSONB queries
create index if not exists analytics_events_props_idx 
  on public.analytics_events using gin(props);
create index if not exists analytics_events_context_idx 
  on public.analytics_events using gin(context);

-- Comments
comment on table public.analytics_events is 'User interaction events for analytics and experimentation';
comment on column public.analytics_events.event_id is 'Unique event identifier (client-generated UUID)';
comment on column public.analytics_events.name is 'Event name (e.g., pin_tap, post_view)';
comment on column public.analytics_events.user_id is 'User ID (null for anonymous users)';
comment on column public.analytics_events.session_id is 'Session ID (30min TTL)';
comment on column public.analytics_events.device_id is 'Device ID (persistent)';
comment on column public.analytics_events.ts_client is 'Client timestamp (when event occurred)';
comment on column public.analytics_events.ts_server is 'Server timestamp (when event received)';
comment on column public.analytics_events.schema_version is 'Event schema version';
comment on column public.analytics_events.context is 'Event context (app_version, build, locale, etc.)';
comment on column public.analytics_events.props is 'Event-specific properties';
comment on column public.analytics_events.source is 'Platform (web, ios, android, desktop)';
comment on column public.analytics_events.ip is 'Client IP address';
comment on column public.analytics_events.ua is 'User agent string';

-- Row-level security (optional)
-- alter table public.analytics_events enable row level security;

-- Example policy (adjust based on your auth setup)
-- create policy "Allow anonymous insert" on public.analytics_events
--   for insert with check (true);
