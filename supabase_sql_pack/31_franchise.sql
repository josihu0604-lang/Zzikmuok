BEGIN;
CREATE TABLE IF NOT EXISTS public.franchise_groups(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.franchise_contracts(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.franchise_groups(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  lock_in_months integer NOT NULL DEFAULT 6,
  is_active boolean NOT NULL DEFAULT true
);
ALTER TABLE public.franchise_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_contracts ENABLE ROW LEVEL SECURITY;
COMMIT;
