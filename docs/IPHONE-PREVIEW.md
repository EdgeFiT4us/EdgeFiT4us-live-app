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
