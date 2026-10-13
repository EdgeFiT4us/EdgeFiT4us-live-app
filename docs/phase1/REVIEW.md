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

## Header refinement — versions A and B

The original `edgefit-icon.png` contained white pieces of the wordmark at the bottom of its crop. The new `public/edgefit-symbol-clean.svg` traces only the supplied orange athlete silhouette, excludes those white pixels, and uses a balanced square viewBox with a small optical alignment adjustment. Original logo files are retained.

The new shared header removes the old glowing image filter and oversized outer brand capsule. The wordmark has a stable baseline and the supporting text is larger, higher contrast, and less widely spaced.

- Version A: rounded-square icon frame (retained for comparison).
- Version B: standalone orange icon with no frame (approved default).

In the running preview, use `?review=headers` for the comparison screen, `?header=A` for the A dashboard, and `?header=B` for B. Header choice does not write or change workout records.

Updated screenshots:

- [A/B mobile comparison](header-comparison-mobile.png)
- [A/B desktop comparison](header-comparison-desktop.png)
- [Version A mobile dashboard](header-A-dashboard-mobile.png)
- [Version B mobile dashboard](header-B-dashboard-mobile.png)
- [Version A desktop dashboard](header-A-dashboard-desktop.png)
- [Version B desktop dashboard](header-B-dashboard-desktop.png)

SVG loading, wordmark/icon vertical alignment, and horizontal overflow checks pass at 320, 375, 390, 430, 768, and 1440 pixels wide for both variants.

## Approved Version B — final dashboard refinement

- Version B remains the official/default header.
- Brightened secondary text, increased small-label sizes, and tightened spacing.
- On mobile, the workout appears before statistics; its primary button appears before exercise/time metadata.
- The label is **View Today’s Workout** because the action opens the plan without starting or saving a workout. Active sessions retain **Resume workout**.
- [Updated mobile dashboard, 390 × 844](dashboard-approved-B-mobile.png)
- [Updated full dashboard](dashboard-approved-B-full.png)

Browser checks confirm the full workout button is above the fixed bottom navigation without scrolling at 320 × 568, 375 × 667, 390 × 844, and 430 × 932. No horizontal overflow. A seeded existing session retained its original ID, notes, set IDs, weight, reps, and timestamp after viewing the plan, recording a new set, and reloading. Screenshots use that isolated test fixture, not a live user's records.

Production build passes, and the 17 workout/migration tests pass. No merge or deployment.

## Screenshot data provenance and account isolation

The earlier Alex Morgan screenshot was captured with a one-off, isolated Chromium test fixture. That fixture contained one synthetic 60 lb × 10 press set, intentionally treated as a real-format record to test preservation. It was not a Supabase account, app seed, default customer, or a copy of the owner's real training history. The 1 personal best was the recorded exercise's baseline maximum, not a claimed improvement. No fixture was saved to a customer account or the live site.

The updated [fresh-user screenshot](dashboard-new-user-zero.png) demonstrates a user-entered name and zero workouts/personal bests. The name is typed by the test browser, never supplied as an application default.

Safeguards in this branch:

- Default profile name is blank; registration and first-use local setup require a nonblank personal name. Signed-in accounts missing a name must finish their own profile.
- A successful account read initializes all workspace keys; absent workouts are an empty array and the active session is null. It never falls back to legacy or preview workout history, or a stale missing-row cache.
- Legacy, design-preview, and each authenticated account use distinct browser storage keys. Preview onboarding and logging do not change legacy records or profiles.
- Demo view shows sample sessions separately, rather than combining them with actual history in one series/list. Sample records never contribute personal stats.
- Cloud-save, account-read, and migration paths reject demo/test-marked workout records. Imports add missing real record IDs only; legacy originals remain unchanged.
- When Supabase is configured, unauthenticated exploration opens only the isolated sample workspace, not the legacy owner workspace. Customer records require sign-in.
- The existing `supabase/phase1.sql` requires the authenticated owner ID for reads/writes. `supabase/data-separation.sql` prepares an additional backend constraint rejecting demo/test workout entries; no SQL has been applied.
- Progress-photo uploads and buckets are not yet implemented or enabled. Before Phase 2 enables them, require a private bucket, user-ID-prefixed paths, owner-only metadata/object policies, and authenticated short-lived reads. No public photo URLs.

The owner's existing browser keys and original history are retained. Future migration requires explicit consent in the owner's authenticated personal account; no automatic account claiming or migration occurs. Live Supabase account/photo isolation testing remains pending service connection and photo implementation.
