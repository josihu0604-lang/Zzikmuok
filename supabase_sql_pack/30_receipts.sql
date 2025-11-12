BEGIN;
CREATE TABLE IF NOT EXISTS public.receipts(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL UNIQUE REFERENCES public.mission_submissions(id) ON DELETE CASCADE,
  url text NOT NULL,
  sha256 text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS receipts_self_read ON public.receipts;
CREATE POLICY receipts_self_read ON public.receipts FOR SELECT
  USING (EXISTS(SELECT 1 FROM public.mission_submissions s WHERE s.id=submission_id AND s.user_id=auth.uid())
    OR EXISTS(SELECT 1 FROM public.users u WHERE u.id=auth.uid() AND u.role='admin'));
COMMIT;
