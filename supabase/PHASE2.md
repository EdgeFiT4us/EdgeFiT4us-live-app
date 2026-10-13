# Supabase connection and approval checkpoint

The browser client uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. An ignored `.env.local` is configured only in the current workspace. Supply the browser-safe values separately in an untracked Codespaces environment; no credentials are committed. The SDK was already installed.

Read-only checks confirmed email registration enabled, email confirmation required, and `user_data` not yet created. No database/auth records have been changed.

## Approval requested

1. Apply `phase2-setup.sql`: create the owner-keyed workspace table, enforce RLS, grant only own read/insert/update, reject demo/test workouts, and increment revisions on updates. Existing rows are preserved; unknown policies abort the transaction for review. Do not also run the older Phase 1 schema scripts.
2. Run `phase2-verify-rls.sql`: two synthetic auth/user-data fixtures inside a transaction, test A/B read/write separation, anonymous denial, demo rejection, and revision updates, then roll back all fixtures. No real emails or customer account signups.

SQL execution requires the Supabase SQL editor or a separately authorized Supabase connection. The publishable key cannot execute administrative SQL. Never request a database password or service-role key in chat.

Before real registration tests, configure Auth URL allowlisting for the actual local/Codespaces preview origin and retain email confirmation. No production URL change is needed yet. End-to-end registration, email verification, password recovery, and authenticated API isolation remain pending schema approval and setup.

## Preservation and sync

Legacy and preview history remain separate from account data. No automatic migration. Cloud saves are serialized, authenticate the owner, and use revision-checked updates. Different workout IDs merge; concurrent conflicting edits to the same workout stop with a recoverable error. Pending account edits are retained under that account's local pending key for reload recovery. No demo/test records are saved to customer history.

No merge, deployment, paid plan, or photo storage provisioning.

## Revised migration awaiting fresh authorization

The original migration contained three `DROP POLICY` statements, one `DROP TRIGGER`, and `CREATE OR REPLACE FUNCTION` to support reruns. Those operations affected schema objects, not customer rows, but they are unnecessary for the currently empty project and have been removed.

The revised `phase2-setup.sql` creates new objects only and aborts if the app table or function already exists. It has no DROP, DELETE, TRUNCATE, or data-changing UPDATE statement. The UPDATE keyword appears only in permission, policy, and trigger definitions for future owner-authorized edits. REVOKE limits access on the newly created table only. No auth users, workout rows, or storage objects are inserted or changed by the migration.

The separate isolation test contains UPDATE and DELETE attempts against synthetic test IDs, plus INSERTs for synthetic identities/rows. It ends with ROLLBACK and cleanup verification. It must receive separate authorization and must not be bundled with the migration.

No revised migration or test has been executed.
