import{describe,it,expect}from'vitest';
import{mergeWorkoutHistory}from'./migration';
import{storageKey}from'./account';
import type{Workout}from'./model';
const a:Workout={id:'a',date:'2026-10-12',notes:'Original',sets:[{id:'set-a',exercise:'Squat',weight:100,reps:8,at:'2026-10-12T16:00:00Z'}]};
describe('non-destructive account migration',()=>{
 it('retains original local storage keys for existing users',()=>expect(storageKey('edgefit-workouts-v1')).toBe('edgefit-workouts-v1'));
 it('isolates each account cache from local history and other accounts',()=>{expect(storageKey('edgefit-workouts-v1','alice')).not.toBe(storageKey('edgefit-workouts-v1','bob'));expect(storageKey('edgefit-workouts-v1','alice')).not.toBe(storageKey('edgefit-workouts-v1'))});
 it('preserves set IDs and timestamps and adds missing records',()=>{const b={...a,id:'b'};const out=mergeWorkoutHistory([a],[b]);expect(out).toEqual([a,b]);expect(out[0]).toBe(a);expect(out[1].sets).toEqual(a.sets)});
 it('never overwrites an existing account record and repeated imports are idempotent',()=>{const first=mergeWorkoutHistory([a],[{...a,notes:'Conflicting legacy copy'},{...a,id:'b'}]);expect(first[0].notes).toBe('Original');expect(mergeWorkoutHistory(first,[a,{...a,id:'b'}])).toEqual(first)});
});
