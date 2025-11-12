BEGIN;
CREATE OR REPLACE FUNCTION public.approve_mission_and_reward(p_submission_id uuid, p_reward_amount numeric)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE v_user uuid; v_mission uuid; v_tx uuid;
BEGIN
  UPDATE public.mission_submissions
     SET status='approved', reviewed_at=now()
   WHERE id=p_submission_id AND status='pending'
   RETURNING user_id, mission_id INTO v_user, v_mission;
  IF NOT FOUND THEN RAISE EXCEPTION 'Submission not found or already processed'; END IF;

  INSERT INTO public.transactions(user_id,type,amount,status,related_mission_id,processed_at)
  VALUES (v_user,'mission_reward',p_reward_amount,'completed',v_mission,now())
  RETURNING id INTO v_tx;

  UPDATE public.users
     SET current_balance = current_balance + p_reward_amount,
         total_earnings = total_earnings + p_reward_amount,
         total_missions_completed = total_missions_completed + 1,
         updated_at = now()
   WHERE id = v_user;

  UPDATE public.missions SET current_participants = current_participants + 1 WHERE id = v_mission;

  RETURN jsonb_build_object('success',true,'transaction_id',v_tx,'user_id',v_user);
END; $$;
COMMIT;
