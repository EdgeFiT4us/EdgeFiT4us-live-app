-- Additional constraint for Phase 1, prepared only. Not applied by the app.
-- Review/clean any pre-existing example rows before applying to an existing project.
alter table public.user_data add constraint customer_workouts_only check (
  key <> 'edgefit-workouts-v1' or (
    jsonb_typeof(value) = 'array'
    and not jsonb_path_exists(value, '$[*] ? (@.demo == true || @.testOnly == true)')
  )
);
-- Phase 2 photo uploads must use a PRIVATE bucket and user_id-prefixed object paths.
-- Require auth.uid() to match the path's first segment for every read/write policy.
-- Photo metadata must carry user_id with owner-only RLS. Never use public object URLs.
-- Photo storage and upload features are not provisioned or enabled in Phase 1.
