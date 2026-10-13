# EdgeFiT4us Phase 1 — design review

Work is on `development/phase-1-accounts-dashboard`. No merge, deployment, database migration, paid service, or Supabase project creation has been performed.

## Working preview

Open a GitHub Codespace on this branch. The included `.devcontainer/devcontainer.json` installs the locked dependencies and starts Vite on port 5173. In the Ports panel, open the **EdgeFiT4us preview** address in your browser. It is a development preview, not the published app. Codespaces is optional and uses your GitHub allowance; no Codespace was created by this change.

Local alternative:

```sh
npm ci
npm run dev -- --port 5173
```

## What you can review

- Welcome, sign-in, registration, forgotten-password screens, and password visibility.
- Choose **Preview profile setup** on registration to exercise onboarding without a real account. This is explicitly a device-local design preview, not simulated authentication.
- Continue on this device preserves the original browser storage keys and existing workflow.
- Modern mobile dashboard, real workout counters, calendar rhythm, recent history, and resumable sessions.
- Full workout logger, history/calendar, progress charts, personal bests, backup export/import.
- Existing logo assets retained.

## Screenshots

Captured from Chromium at 390 × 844 and at a desktop viewport:

- [Welcome](welcome-mobile.png)
- [Sign-in](signin-mobile.png)
- [Registration](registration-mobile.png)
- [Fitness profile](profile-setup-mobile.png)
- [Dashboard](dashboard-mobile.png)
- [Workout history](history-mobile.png)
- [Desktop welcome](welcome-desktop.png)

Screenshots use an isolated test browser with a preview profile and test workout, not live user records.

## Supabase readiness

No Supabase project or credentials are connected. Real email/password authentication, recovery-email delivery, cloud save, and row-level isolation have therefore **not been verified against a live backend**. Preview sign-in reports that limitation and never stores a password.

Integration code, `.env.example`, and `supabase/phase1.sql` are prepared for review. When the user connects an existing free project:

1. Apply the SQL manually after review; it defines owner-restricted `user_data` records and RLS policies. Do not rerun the policy statements once applied without a migration.
2. Add the project URL and browser-safe publishable/anon key in an untracked `.env.local`. Never use a service-role key in frontend variables.
3. Configure Supabase Auth site/redirect URLs for the actual preview and future production origin. Enable email confirmation and use the project's default email settings for initial testing.
4. Verify registration, verification, sign-in, reset, logout, cross-account isolation, error handling, and cloud saves before release.

Account caches are separate from device-local history and other accounts. Existing local history is never automatically claimed by a newly signed-in account. The user can explicitly copy local history into their account. Copy/import merges missing workout IDs and preserves existing records and timestamps. Local originals remain intact. Backups from another origin/device can be imported non-destructively.

Concurrent multi-device edits of the same JSON workspace require conflict handling before production synchronization is released. Do not enable this prototype's cloud persistence for concurrent production use without that work and backend tests.

## Verification

- Production TypeScript/Vite build succeeds.
- 17 Vitest tests pass: 13 existing workout tests plus 4 migration/storage-isolation tests.
- Browser checks pass for preview sign-in errors, profile onboarding, set recording, reload recovery, history, profile changes, and mobile horizontal overflow.
- Live backend authentication tests remain pending the Supabase connection.

Progress-photo uploads, image comparisons, routine personalization, and exercise demonstrations remain out of Phase 1.
