-- REVISED MIGRATION: review and fresh approval required before execution.
-- Creates new objects only; aborts if an app table/function already exists.
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.user_data') IS NOT NULL THEN
    RAISE EXCEPTION 'user_data already exists. Stop and review; nothing will be replaced.';
  END IF;
  IF to_regprocedure('public.edgefit_revision()') IS NOT NULL THEN
    RAISE EXCEPTION 'edgefit_revision already exists. Stop and review; nothing will be replaced.';
  END IF;
END;
$$;

CREATE TABLE public.user_data (
  user_id uuid NOT NULL REFERENCES auth.users(id),
  key text NOT NULL CHECK (
    key IN (
      'edgefit-profile-v1',
      'edgefit-workouts-v1',
      'edgefit-active-session-v1'
    )
  ),
  value jsonb NOT NULL,
  revision bigint NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, key),
  CONSTRAINT customer_workouts_only CHECK (
    key <> 'edgefit-workouts-v1'
    OR (
      jsonb_typeof(value) = 'array'
      AND NOT jsonb_path_exists(
        value,
        '$[*] ? (@.demo == true || @.testOnly == true)'
      )
    )
  )
);

ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_data FORCE ROW LEVEL SECURITY;

-- Restrict permissions on this newly created table only.
REVOKE ALL ON TABLE public.user_data FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.user_data TO authenticated;

CREATE POLICY "Read own fitness data"
  ON public.user_data FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Insert own fitness data"
  ON public.user_data FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Update own fitness data"
  ON public.user_data FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE FUNCTION public.edgefit_revision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.revision := OLD.revision + 1;
  RETURN NEW;
END;
$$;

CREATE TRIGGER edgefit_revision
  BEFORE UPDATE ON public.user_data
  FOR EACH ROW
  EXECUTE FUNCTION public.edgefit_revision();

COMMIT;
