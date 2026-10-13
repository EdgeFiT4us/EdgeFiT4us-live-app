import {supabase} from './utils/supabase';
import {customerWorkouts,WORKOUTS_KEY} from './accountData';
import type {Workout} from './model';
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
export function reconcileHistory(base:Workout[],local:Workout[],remote:Workout[]){
 const b=new Map(base.map(w=>[w.id,w])),l=new Map(customerWorkouts(local).map(w=>[w.id,w])),r=new Map(customerWorkouts(remote).map(w=>[w.id,w]));
 for(const id of new Set([...b.keys(),...l.keys()])){
  const before=b.get(id),next=l.get(id),current=r.get(id);
  if(same(before,next))continue;
  if(!same(before,current)&&!same(next,current))throw Error('This workout changed on another device. Your local copy is preserved. Export a backup before resolving the conflict.');
  if(next)r.set(id,next);else r.delete(id);
 }
 return [...r.values()];
}
const queues=new Map<string,Promise<unknown>>();
export async function flushCloudSaves(){await Promise.all([...queues.values()])}
export function saveCloudValue(userId:string,key:string,value:unknown,baseline:unknown){
 const scope=`${userId}:${key}`;
 const task=(queues.get(scope)||Promise.resolve()).catch(()=>{}).then(async()=>{
  if(!supabase)throw Error('Supabase is not configured.');
  const base=typeof baseline==='function'?baseline():baseline;
  const{data:identity,error:authError}=await supabase.auth.getUser();
  if(authError||identity.user?.id!==userId)throw Error('Sign in again before syncing. Your local changes are preserved.');
  for(let attempt=0;attempt<3;attempt++){
   const{data:row,error:readError}=await supabase.from('user_data').select('value,revision').eq('user_id',userId).eq('key',key).maybeSingle();
   if(readError)throw readError;
   const clean=key===WORKOUTS_KEY?customerWorkouts(value as Workout[]):value;
   if(!row){const{error}=await supabase.from('user_data').insert({user_id:userId,key,value:clean});if(error?.code==='23505')continue;if(error)throw error;return clean;}
   const merged=key===WORKOUTS_KEY?reconcileHistory((base as Workout[])||[],clean as Workout[],row.value):same(row.value,base)||same(row.value,clean)?clean:undefined;
   if(merged===undefined)throw Error('These settings changed on another device. Your local copy is preserved. Export a backup before resolving the conflict.');
   const{data:updated,error}=await supabase.from('user_data').update({value:merged}).eq('user_id',userId).eq('key',key).eq('revision',row.revision).select('revision');
   if(error)throw error;if(updated?.length)return merged;
  }
  throw Error('Another device is updating this data. Your local copy is preserved; try again.');
 });
 queues.set(scope,task);void task.finally(()=>{if(queues.get(scope)===task)queues.delete(scope)}).catch(()=>{});return task;
}
