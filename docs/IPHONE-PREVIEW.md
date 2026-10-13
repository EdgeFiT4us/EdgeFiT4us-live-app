# Private iPhone test preview

Branch: `development/phase-1-accounts-dashboard`. No database migrations, deployment, or real account creation is required.

1. Sign in to GitHub in Safari using the account that owns the repository.
2. Open https://github.com/codespaces/new?hide_repo_select=true&repo=1416204747&ref=development%2Fphase-1-accounts-dashboard
3. Confirm this development branch is selected. Create a Codespace only if GitHub shows available free quota. No Codespace was created by the assistant.
4. Wait for setup to complete. The development container installs dependencies and starts the safe preview on port 5173 automatically.
5. In the Codespaces **Ports** panel, leave port 5173 **Private**, then tap **Open in Browser** (globe). Use Safari's Request Desktop Website if the controls are hidden. GitHub will provide the actual private HTTPS preview address; sign in if prompted. Do not change the port visibility to Public.
6. Tap **Open safe test preview**. Enter a test name and fitness preferences, then **Save preview profile**. You should see **Design preview · Sample profile** and initially zero workouts/records.
7. Tap **View Today’s Workout**. Choose an exercise from the plan or the logger's exercise selector. Enter weight/reps, tap **Save Set** for each set, then **Finish Workout & View Summary**.
8. Open **History** and **Progress**. Log another session for the same exercise with a changed weight/reps to test comparisons and charts. Reload to check that test records remain in the preview browser.
9. Stop the Codespace when finished to avoid unnecessary resource usage.

The safe preview forcibly disables the Supabase client even if real project variables are present. It uses separate `:design-preview` storage keys and never imports legacy history automatically. Preview records belong only to this test workspace. Any optional **Show demo data** view is sample-only and separate from records you log.

Real registration/login/cloud synchronization remain pending SQL review and database setup. This preview tests the app's profile and training workflows, not live account security. Original device history remains in its original browser/origin, unaffected by a Codespaces test preview.

## Workout selection update

Chest + Arms is the first suggested routine for a workspace without a previous selection. It has Flat Dumbbell Press (4 sets), Incline Dumbbell Press (3), Cable Chest Fly (3), Overhead Triceps Extension (3), Rope Triceps Pushdown (3), and Preacher Curl (3).

Use **Change Workout** on Home or Log to filter by muscle group, choose a suggestion, or create a custom routine. Selecting another routine keeps all sets in the active session. The routine selection and custom routines persist on this device, scoped to the preview or signed-in account. These preferences are not cloud-synchronized yet. No existing workout history is rewritten.

Verified using an iPhone-sized Chromium viewport: profile setup, initial Chest + Arms suggestion, muscle-group selection, custom routine creation, two individual saved sets, switching without losing sets, selected routine and active-session recovery after reload, workout completion, history and progress charts. Checked no horizontal overflow at 320, 375, 390, and 430px widths. No Supabase requests occurred, and original history storage remained unchanged. Browser simulation does not replace testing on physical iPhone Safari.

For an existing Codespace, stop the dev server, run `git pull --ff-only` while on the development branch, and restart with `VITE_PREVIEW_MODE=true npm run dev -- --port 5173`. Keep the port private. A newly created Codespace loads these changes automatically.
