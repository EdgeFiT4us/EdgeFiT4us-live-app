-- Run manually in an existing free Supabase project's SQL editor after review.
-- No changes to the live app or existing local workout data.
create table if not exists public.user_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null check (key in ('edgefit-profile-v1','edgefit-workouts-v1','edgefit-active-session-v1')),
  value jsonb not null,
  primary key (user_id,key)
);
alter table public.user_data enable row level security;
create policy "Read own fitness data" on public.user_data for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own fitness data" on public.user_data for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own fitness data" on public.user_data for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.user_data from anon;
grant select,insert,update on public.user_data to authenticated;
