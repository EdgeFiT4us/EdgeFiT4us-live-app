import {dateKey,uid,type Workout,type SetLog,volume} from './model';
export type LiveWorkout=Workout & {startedAt?:string;completedAt?:string};
export type SetFeedback={message:string;isPR:boolean;improvedWeight:boolean;improvedReps:boolean;improvedStrength:boolean;improvedVolume:boolean};
export const estimatedOneRepMax=(weight:number,reps:number)=>weight*(1+reps/30);
export function startSession(now=new Date()):LiveWorkout{return {id:uid(),date:dateKey(now),notes:'',sets:[],startedAt:now.toISOString()};}
export function saveLiveSet(session:LiveWorkout,exercise:string,weight:number,reps:number,now=new Date()):LiveWorkout{
 if(!exercise.trim()||!Number.isFinite(weight)||weight<0||!Number.isInteger(reps)||reps<1||reps>1000)throw Error('Invalid set');
 return {...session,sets:[...session.sets,{id:uid(),exercise,weight,reps,at:now.toISOString()}]};
}
export function editLiveSet(session:LiveWorkout,id:string,weight:number,reps:number):LiveWorkout{
 if(!Number.isFinite(weight)||weight<0||!Number.isInteger(reps)||reps<1||reps>1000)throw Error('Invalid set');
 if(!session.sets.some(s=>s.id===id))throw Error('Unknown set');
 return {...session,sets:session.sets.map(s=>s.id===id?{...s,weight,reps}:s)};
}
export function deleteLiveSet(session:LiveWorkout,id:string):LiveWorkout{return {...session,sets:session.sets.filter(s=>s.id!==id)};}
export function previousSession(workouts:Workout[],exercise:string,currentId:string):Workout|undefined{
 return [...workouts].filter(w=>!w.demo&&w.id!==currentId&&w.sets.some(s=>s.exercise===exercise)).sort((a,b)=>{
  const at=Math.max(...a.sets.map(s=>Date.parse(s.at)||0),Date.parse(a.date)||0);
  const bt=Math.max(...b.sets.map(s=>Date.parse(s.at)||0),Date.parse(b.date)||0);
  return bt-at;
 })[0];
}
export function compareSet(previous:Workout[],current:LiveWorkout,newSet:SetLog):SetFeedback{
 const history=previous.filter(w=>!w.demo&&w.id!==current.id).flatMap(w=>w.sets.filter(s=>s.exercise===newSet.exercise));
 const old=previousSession(previous,newSet.exercise,current.id);
 const oldSets=old?.sets.filter(s=>s.exercise===newSet.exercise)??[];
 const beforeCurrent=current.sets.filter(s=>s.exercise===newSet.exercise&&s.id!==newSet.id);
 const prior=[...history,...beforeCurrent];
 const bestWeight=Math.max(0,...prior.map(s=>s.weight));
 const bestRepsAtWeight=Math.max(0,...prior.filter(s=>s.weight===newSet.weight).map(s=>s.reps));
 const bestStrength=Math.max(0,...prior.map(s=>estimatedOneRepMax(s.weight,s.reps)));
 const improvedWeight=history.length>0&&newSet.weight>bestWeight;
 const improvedReps=history.length>0&&bestRepsAtWeight>0&&newSet.reps>bestRepsAtWeight;
 const improvedStrength=history.length>0&&estimatedOneRepMax(newSet.weight,newSet.reps)>bestStrength+0.00001;
 const previousVolume=oldSets.reduce((n,s)=>n+s.weight*s.reps,0);
 const currentVolume=current.sets.filter(s=>s.exercise===newSet.exercise).reduce((n,s)=>n+s.weight*s.reps,0);
 const improvedVolume=!!old&&previousVolume>0&&currentVolume>previousVolume;
 const isPR=improvedWeight||improvedReps||improvedStrength;
 let message='Set saved. Every rep builds discipline.';
 if(improvedWeight)message=`NEW PERSONAL RECORD! ${newSet.weight} lb beats your previous ${bestWeight} lb. You're getting stronger!`;
 else if(improvedStrength)message='NEW ESTIMATED STRENGTH RECORD! Your hard work is showing.';
 else if(improvedReps)message=`REP RECORD! You completed more reps at ${newSet.weight} lb.`;
 else if(improvedVolume)message='You surpassed your previous session’s exercise volume!';
 else if(oldSets.length&&newSet.weight>=Math.max(...oldSets.map(s=>s.weight))&&newSet.reps>=Math.max(...oldSets.filter(s=>s.weight===newSet.weight).map(s=>s.reps),0))message='Strong consistency! You matched or improved on last session.';
 return {message,isPR,improvedWeight,improvedReps,improvedStrength,improvedVolume};
}
export function finishSession(session:LiveWorkout,now=new Date()):LiveWorkout{return {...session,completedAt:now.toISOString()};}
export function sessionSummary(current:LiveWorkout,history:Workout[]){
 const exercises=[...new Set(current.sets.map(s=>s.exercise))];
 const improvements=exercises.flatMap(ex=>{
  const old=previousSession(history,ex,current.id); if(!old)return [];
  const before=old.sets.filter(s=>s.exercise===ex),after=current.sets.filter(s=>s.exercise===ex);
  const prevTop=Math.max(...before.map(s=>s.weight)); const top=Math.max(...after.map(s=>s.weight));
  const prevVol=before.reduce((n,s)=>n+s.weight*s.reps,0);const vol=after.reduce((n,s)=>n+s.weight*s.reps,0);
  return [...(top>prevTop?[`${ex}: top weight +${top-prevTop} lb`]:[]),...(vol>prevVol?[`${ex}: volume +${vol-prevVol} lb`]:[])];
 });
 return {sets:current.sets.length,exercises:exercises.length,volume:volume(current),improvements,suggestion:exercises.length?'Next time, compare your first working set with today’s and aim for one controlled improvement.':'Record your first set to begin.'};
}
