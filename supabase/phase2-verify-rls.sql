-- APPROVAL REQUIRED. Run only after phase2-setup.sql.
-- Synthetic users and rows are transaction-only; ROLLBACK removes every fixture.
-- No email signup, real workout import, or customer record modification.
begin;
insert into auth.users(id,aud,role,email) values
 ('ef440000-0000-4000-8000-000000000001','authenticated','authenticated','edgefit-rls-a@example.invalid'),
 ('ef440000-0000-4000-8000-000000000002','authenticated','authenticated','edgefit-rls-b@example.invalid');
insert into public.user_data(user_id,key,value) values
 ('ef440000-0000-4000-8000-000000000001','edgefit-profile-v1','{"name":"RLS test A"}'),
 ('ef440000-0000-4000-8000-000000000002','edgefit-profile-v1','{"name":"RLS test B"}');
set local role authenticated;
select set_config('request.jwt.claim.sub','ef440000-0000-4000-8000-000000000001',true);
select set_config('request.jwt.claims','{"sub":"ef440000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$ declare n integer; begin
 select count(*) into n from public.user_data;
 if n<>1 then raise exception 'FAIL: A can read rows outside its own fixture'; end if;
 update public.user_data set value='{"name":"Unauthorized"}' where user_id='ef440000-0000-4000-8000-000000000002';
 get diagnostics n=row_count;
 if n<>0 then raise exception 'FAIL: A updated B'; end if;
 begin
  delete from public.user_data where user_id='ef440000-0000-4000-8000-000000000002';
  get diagnostics n=row_count;
  if n<>0 then raise exception 'FAIL: A deleted B'; end if;
 exception when insufficient_privilege then null; end;
 begin
  insert into public.user_data(user_id,key,value) values ('ef440000-0000-4000-8000-000000000002','edgefit-active-session-v1','null');
  raise exception 'FAIL: A inserted data for B';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.user_data(user_id,key,value) values ('ef440000-0000-4000-8000-000000000001','edgefit-workouts-v1','[{"demo":true}]');
  raise exception 'FAIL: demo data accepted';
 exception when check_violation then null; end;
 update public.user_data set value='{"name":"RLS test A updated"}' where user_id='ef440000-0000-4000-8000-000000000001';
 select count(*) into n from public.user_data where revision=2;
 if n<>1 then raise exception 'FAIL: own update or revision tracking'; end if;
end $$;
select set_config('request.jwt.claim.sub','ef440000-0000-4000-8000-000000000002',true);
select set_config('request.jwt.claims','{"sub":"ef440000-0000-4000-8000-000000000002","role":"authenticated"}',true);
do $$ declare n integer; begin
 select count(*) into n from public.user_data;
 if n<>1 then raise exception 'FAIL: B isolation'; end if;
 if exists(select 1 from public.user_data where user_id='ef440000-0000-4000-8000-000000000001') then raise exception 'FAIL: B reads A'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform 1 from public.user_data; raise exception 'FAIL: anonymous table access';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
do $$ begin
 if exists(select 1 from auth.users where id in ('ef440000-0000-4000-8000-000000000001','ef440000-0000-4000-8000-000000000002'))
 or exists(select 1 from public.user_data where user_id in ('ef440000-0000-4000-8000-000000000001','ef440000-0000-4000-8000-000000000002')) then
 raise exception 'FAIL: temporary test fixtures remain';
 end if;
end $$;
select 'RLS checks passed; all fixtures rolled back' as result;
