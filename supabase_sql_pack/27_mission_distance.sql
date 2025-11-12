BEGIN;
CREATE OR REPLACE FUNCTION public.get_mission_distance_and_status(
  p_mission_id uuid, p_user_lat double precision, p_user_lng double precision
) RETURNS TABLE(status text, deadline timestamptz, dist_m double precision)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT m.status, m.deadline,
         ST_Distance(p.location::geography,
                     ST_SetSRID(ST_MakePoint(p_user_lng,p_user_lat),4326)::geography)
  FROM public.missions m
  JOIN public.partners p ON p.id=m.partner_id
  WHERE m.id=p_mission_id;
END; $$;
COMMIT;
