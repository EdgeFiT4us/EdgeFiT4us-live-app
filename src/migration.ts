import type {Workout} from './model';
// Add missing legacy records without replacing an account's existing record IDs.
export function mergeWorkoutHistory(account:Workout[],legacy:Workout[]):Workout[]{
 const ids=new Set(account.map(w=>w.id));
 return [...account,...legacy.filter(w=>!ids.has(w.id))];
}
