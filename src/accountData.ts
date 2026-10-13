import {defaultProfile,type Profile,type Workout,isReal} from './model';
export const PROFILE_KEY='edgefit-profile-v1';
export const WORKOUTS_KEY='edgefit-workouts-v1';
export const ACTIVE_KEY='edgefit-active-session-v1';
export const storageKey=(key:string,userId?:string,preview=false)=>userId?`${key}:account:${userId}`:preview?`${key}:design-preview`:key;
// A successful server read is authoritative, even when the account has no records.
// Never inherit another workspace's cached name, workouts, or active session.
export function createAccountWorkspace(rows:Record<string,unknown>,metadata:Record<string,unknown>={}){
 const fitness=metadata.fitness_profile as Partial<Profile>|undefined;
 const profile=rows[PROFILE_KEY] as Profile|undefined;
 return {...rows,[PROFILE_KEY]:profile||{...defaultProfile,...fitness,name:fitness?.name?.trim()||(typeof metadata.name==='string'?metadata.name.trim():'')},[WORKOUTS_KEY]:Array.isArray(rows[WORKOUTS_KEY])?(rows[WORKOUTS_KEY] as Workout[]).filter(isReal):[],[ACTIVE_KEY]:rows[ACTIVE_KEY]??null};
}
export function customerWorkouts(workouts:Workout[]){return workouts.filter(isReal)}
