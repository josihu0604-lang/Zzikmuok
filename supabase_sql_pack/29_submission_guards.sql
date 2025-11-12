BEGIN; SET LOCAL search_path=public;
CREATE TABLE IF NOT EXISTS public.qr_challenges(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  issued_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used_at timestamptz, used_by uuid REFERENCES public.users(id)
);
DO $$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mission_submissions' AND column_name='qr_challenge_id')
  THEN ALTER TABLE public.mission_submissions ADD COLUMN qr_challenge_id uuid REFERENCES public.qr_challenges(id); END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mission_submissions' AND column_name='qr_scanned_at')
  THEN ALTER TABLE public.mission_submissions ADD COLUMN qr_scanned_at timestamptz; END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mission_submissions' AND column_name='receipt_url')
  THEN ALTER TABLE public.mission_submissions ADD COLUMN receipt_url text; END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='mission_submissions' AND column_name='receipt_sha256')
  THEN ALTER TABLE public.mission_submissions ADD COLUMN receipt_sha256 text; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.fn_validate_submission_on_approval()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_loc geography; v_pid uuid; v_status text; v_deadline timestamptz; v_qr record;
BEGIN
  IF NOT (TG_OP='UPDATE' AND NEW.status='approved' AND (OLD.status IS DISTINCT FROM 'approved')) THEN RETURN NEW; END IF;
  IF NEW.checkin_location IS NULL OR NEW.qr_challenge_id IS NULL OR NEW.qr_scanned_at IS NULL THEN
    RAISE EXCEPTION 'Missing fields';
  END IF;

  SELECT m.status,m.deadline,p.location,p.id INTO v_status,v_deadline,v_loc,v_pid
  FROM public.missions m JOIN public.partners p ON p.id=m.partner_id WHERE m.id=NEW.mission_id;

  IF v_status<>'active' OR v_deadline<=now() THEN RAISE EXCEPTION 'Mission inactive'; END IF;
  IF ST_Distance(v_loc, NEW.checkin_location) > 50 THEN RAISE EXCEPTION 'Too far'; END IF;
  IF abs(extract(epoch from (NEW.submitted_at - NEW.qr_scanned_at))) > 300 THEN RAISE EXCEPTION 'QR time window exceeded'; END IF;

  SELECT * INTO v_qr FROM public.qr_challenges WHERE id=NEW.qr_challenge_id;
  IF NOT FOUND OR v_qr.partner_id<>v_pid OR v_qr.expires_at<=NEW.qr_scanned_at OR v_qr.used_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invalid QR';
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS t_submissions_validate_on_approval ON public.mission_submissions;
CREATE TRIGGER t_submissions_validate_on_approval
BEFORE UPDATE ON public.mission_submissions
FOR EACH ROW EXECUTE FUNCTION public.fn_validate_submission_on_approval();

CREATE OR REPLACE FUNCTION public.fn_mark_qr_used_after_approval()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP='UPDATE' AND NEW.status='approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    UPDATE public.qr_challenges SET used_at=now(), used_by=NEW.user_id
    WHERE id=NEW.qr_challenge_id AND used_at IS NULL;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS t_submissions_mark_qr_used ON public.mission_submissions;
CREATE TRIGGER t_submissions_mark_qr_used
AFTER UPDATE ON public.mission_submissions
FOR EACH ROW EXECUTE FUNCTION public.fn_mark_qr_used_after_approval();

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
                 WHERE c.relkind='i' AND c.relname='uq_tx_user_mission_type_completed')
  THEN CREATE UNIQUE INDEX uq_tx_user_mission_type_completed
       ON public.transactions(user_id, related_mission_id, type) WHERE status='completed';
  END IF;
END $$;
COMMIT;
