import{describe,it,expect}from'vitest';
import{createAccountWorkspace,customerWorkouts,storageKey,PROFILE_KEY,WORKOUTS_KEY,ACTIVE_KEY}from'./accountData';
import{defaultProfile,DEMOS,prs,weekCount,achievement,type Workout}from'./model';
import{mergeWorkoutHistory}from'./migration';
const real:Workout={id:'owner-real',date:'2026-10-12',notes:'Keep unchanged',sets:[{id:'owner-set',exercise:'Press',weight:80,reps:10,at:'2026-10-12T16:00:00Z'}]};
describe('account ownership and empty defaults',()=>{
 it('has no customer default name or seeded workouts',()=>{expect(defaultProfile.name).toBe('');const a=createAccountWorkspace({}, {name:'Morgan'});expect(a[PROFILE_KEY].name).toBe('Morgan');expect(a[WORKOUTS_KEY]).toEqual([]);expect(a[ACTIVE_KEY]).toBe(null);expect(prs(a[WORKOUTS_KEY]).size).toBe(0)});
 it('uses each account’s own registration profile, never an example name',()=>{const a=createAccountWorkspace({}, {fitness_profile:{name:'Jamie',goal:'Build muscle'}}),b=createAccountWorkspace({}, {fitness_profile:{name:'Sam'}});expect(a[PROFILE_KEY].name).toBe('Jamie');expect(b[PROFILE_KEY].name).toBe('Sam');expect(a[WORKOUTS_KEY]).toEqual(b[WORKOUTS_KEY])});
 it('keeps preview, legacy, and account storage keys separate',()=>{const keys=[storageKey(WORKOUTS_KEY),storageKey(WORKOUTS_KEY,undefined,true),storageKey(WORKOUTS_KEY,'user-a'),storageKey(WORKOUTS_KEY,'user-b')];expect(new Set(keys).size).toBe(4)});
 it('excludes demos and test-only workouts from cloud account data and personal records',()=>{const test={...real,id:'test',testOnly:true};expect(customerWorkouts([...DEMOS,test])).toEqual([]);expect(prs([...DEMOS,test]).size).toBe(0);expect(weekCount([...DEMOS,test],new Date('2026-10-12T12:00:00'))).toBe(0);expect(achievement([real],test,'Press')).toBe(null)});
 it('filters examples on account loading without mutating stored records',()=>{const rows={[WORKOUTS_KEY]:[real,...DEMOS]};const loaded=createAccountWorkspace(rows,{name:'Owner'});expect(loaded[WORKOUTS_KEY]).toEqual([real]);expect(rows[WORKOUTS_KEY]).toHaveLength(1+DEMOS.length);expect(loaded[WORKOUTS_KEY][0]).toBe(real)});
 it('explicit migration keeps real IDs, timestamps and notes while rejecting demos and duplicates',()=>{const legacy=[real,...DEMOS,{...real,id:'test',testOnly:true},real];const original=JSON.stringify(legacy);expect(mergeWorkoutHistory([],legacy)).toEqual([real]);expect(JSON.stringify(legacy)).toBe(original)});
});
