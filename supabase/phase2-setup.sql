-- APPROVAL REQUIRED. Prepared for review; not executed by the application.
-- No existing rows, auth users, legacy records, or storage buckets are deleted.
begin;
create table if not exists public.user_data (
 user_id uuid not null references auth.users(id),
 key text not null check (key in ('edgefit-profile-v1','edgefit-workouts-v1','edgefit-active-session-v1')),
 value jsonb not null,
 revision bigint not null default 1,
 primary key (user_id,key)
);
alter table public.user_data add column if not exists revision bigint not null default 1;
alter table public.user_data enable row level security;
alter table public.user_data force row level security;
-- Abort rather than silently retaining unknown policies that could grant access.
do $$ begin
 if exists (select 1 from pg_policies where schemaname='public' and tablename='user_data'
 and policyname not in ('Read own fitness data','Insert own fitness data','Update own fitness data')) then
 raise exception 'Unexpected user_data policies: review before applying this migration';
 end if;
end $$;
drop policy if exists "Read own fitness data" on public.user_data;
drop policy if exists "Insert own fitness data" on public.user_data;
drop policy if exists "Update own fitness data" on public.user_data;
create policy "Read own fitness data" on public.user_data for select to authenticated using ((select auth.uid())=user_id);
create policy "Insert own fitness data" on public.user_data for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Update own fitness data" on public.user_data for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
revoke all on public.user_data from anon;
revoke all on public.user_data from authenticated;
grant select,insert,update on public.user_data to authenticated;
create or replace function public.edgefit_revision() returns trigger language plpgsql set search_path='' as $$
begin new.revision=old.revision+1; return new; end $$;
drop trigger if exists edgefit_revision on public.user_data;
create trigger edgefit_revision before update on public.user_data for each row execute function public.edgefit_revision();
do $$ begin
 if not exists(select 1 from pg_constraint where conrelid='public.user_data'::regclass and conname='customer_workouts_only') then
 alter table public.user_data add constraint customer_workouts_only check (
 key <> 'edgefit-workouts-v1' or (jsonb_typeof(value)='array' and not jsonb_path_exists(value,'$[*] ? (@.demo == true || @.testOnly == true)'))
 );
 end if;
end $$;
commit;
