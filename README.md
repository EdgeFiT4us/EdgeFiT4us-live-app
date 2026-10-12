# EdgeFiT4us — Fitness Motivation & Progress Tracker (MVP)

A mobile-first React + TypeScript + Vite + Tailwind app. Includes dashboard, set-by-set logging, workout history and calendar, progress charts, personal bests, and editable athlete profile. Uses the supplied EdgeFiT4us logo in `public/edgefit-logo.png`.

## Setup

Install Node.js 20.19+ or 22+, then in this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (typically http://localhost:5173). On the same Wi-Fi as your development computer, open `http://YOUR_COMPUTER_LAN_IP:5173` on your iPhone (allow through Windows Firewall if asked). Add it to your home screen using Safari > Share > Add to Home Screen. Your phone and desktop maintain **separate local storage**; they do not sync.

```bash
npm run build
```

Build output is in `dist/` and can be hosted on Netlify or Vercel using build command `npm run build`, output folder `dist`.

## Test walkthrough

1. Open Home. With fresh storage, counters should read 0 and no fake achievements appear.
2. Open Log and enter Flat Dumbbell Press, 60 lb, 10 reps. Tap Save Completed Set, and refresh the page: the data should persist.
3. Record another session with a heavier set to earn a verified personal record. Return to dashboard for achievement text.
4. Visit History to see saved sessions and calendar markers. Tap Progress for strength and volume charts.
5. Enable the demo toggle in History/Progress to inspect clearly marked example sessions without counting them as personal achievements.
6. Edit Profile and refresh to verify persistence. Export a JSON backup.

## Architecture

- `src/model.ts`: workout types and progress computation (replaceable domain layer).
- `src/main.tsx`: React screens and local persistence hook. Future auth/database can replace the storage hook with a repository + user identity.
- No billing is enabled. A $3.99 monthly subscription can be integrated later through an authentication-backed billing service.

Important: Data is stored per browser/device using localStorage, and may be lost if browser storage is deleted. Backup export/import is provided for portability. The prototype has no accounts or cloud syncing.


## Live set-by-set tracking (v1.1)
- Open **Log** and choose an exercise. Prior real session sets are displayed, excluding demonstration workouts.
- Enter weight and reps and tap **Save Set**. Each set is saved with an ISO timestamp to browser localStorage immediately through the React persistence hook.
- **Edit** or **delete** entries as needed. The active workout ID is persisted and automatically recovered after reload.
- See the live timer, set count, current volume, and short feedback. Tap **Finish Workout** for a session summary.
- No automatic billing or backend sync. Keep regular JSON backups from Profile.
- Run `npm test` after `npm install`; test cases are in `src/live.test.ts` and `src/model.test.ts`.
- Important: All-time record comparisons require existing real training history; demonstration workouts are ignored. The visual dashboard preview is illustrative, not a capture of a running app.
