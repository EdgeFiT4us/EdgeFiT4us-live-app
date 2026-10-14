import React,{useState} from 'react';
import type {Workout} from './model';

export const MOTIVATION_28 = [
'Live on the edge. Train beyond it.',
'Push your limits. Find your edge.',
'An edge above the rest.',
'Stronger. Sharper. On the edge.',
'No limits. Just the edge.',
'Where strength meets the edge.',
'Rise to the edge.',
'Stay sharp. Stay on edge.',
'The edge is just the beginning.',
'EdgeFiT4us: Training on the edge of greatness.',
'No peak is too high to climb.',
'Show up. Stay sharp. Edge closer.',
'Earn today. Own tomorrow.',
'Discipline first. Motivation follows.',
'Small steps. Sharp focus.',
'Every rep is a step toward greatness.',
'Your only competition is who you were yesterday.',
'Progress is earned, one day at a time.',
"Strength isn't given. It's built.",
'Every small victory deserves recognition.',
"You're stronger than when you started.",
'Consistency builds what motivation begins.',
"Your journey doesn't end at the edge.",
'Recovery builds strength, too.',
'Believe in your progress. Trust your discipline.',
"Today's effort becomes tomorrow's strength.",
"You've come this far. Keep climbing.",
"This isn't the finish line. It's your new beginning."
] as const;
export const phraseOfDay=(date=new Date())=>MOTIVATION_28[Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000)%MOTIVATION_28.length];

export type Readiness={energy:number;sleep:number;soreness:number;pain:boolean};
export function assessReadiness(r:Readiness){
 if(r.pain)return {level:'Recovery recommended',detail:'Pain is a reason to pause painful movements. Consider rest or gentle pain-free activity; seek professional advice for persistent or concerning pain.',volume:0};
 if(r.energy<=2||r.sleep<=2||r.soreness>=4)return {level:'Light day',detail:'Consider easier weights, fewer sets, and a longer warm-up. Stop if you feel unwell.',volume:0.65};
 if(r.energy>=4&&r.sleep>=4&&r.soreness<=2)return {level:'Normal training',detail:'You appear ready for your plan. Progress gradually only if previous sets were controlled.',volume:1};
 return {level:'Moderate day',detail:'Keep the planned exercises, avoid max efforts, and adjust sets based on how warm-ups feel.',volume:0.85};
}
export const GUIDES:Record<string,{muscles:string;steps:string[];voice:string}>={
 'Flat Dumbbell Press':{muscles:'Chest, triceps, front shoulders',steps:['Lie on a flat bench with feet firmly planted.','Brace and set shoulder blades gently back and down.','Lower dumbbells in control; keep wrists stacked above elbows.','Press up smoothly without bouncing or locking painfully.'],voice:'Plant your feet. Set your shoulder blades. Lower under control, then press smoothly.'},
 'Incline Dumbbell Press':{muscles:'Upper chest, triceps, front shoulders',steps:['Set bench at a low to moderate incline.','Plant feet and keep wrists aligned.','Lower dumbbells slowly to a comfortable depth.','Press upward without shrugging shoulders.'],voice:'Set a comfortable incline. Control the lowering. Press up without shrugging.'},
 'Cable Fly':{muscles:'Chest',steps:['Set cable handles near chest height.','Stand in a staggered stance with soft elbows.','Bring hands together in a controlled arc.','Return slowly without overextending shoulders.'],voice:'Keep a slight bend at your elbows. Bring hands together. Return with control.'},
 'Overhead Triceps Extension':{muscles:'Triceps',steps:['Face away from the cable with rope overhead.','Keep upper arms stable near the head.','Extend elbows without arching your back.','Return slowly to a comfortable bend.'],voice:'Brace your core. Keep upper arms steady. Extend your elbows with control.'},
 'Rope Triceps Pushdown':{muscles:'Triceps',steps:['Stand tall, elbows close to your sides.','Push rope down by straightening elbows.','Separate rope ends gently near the bottom.','Return slowly without letting shoulders swing.'],voice:'Elbows stay near your sides. Push down smoothly. Return slowly.'},
 'Preacher Curl':{muscles:'Biceps',steps:['Adjust seat so upper arms rest comfortably on pad.','Curl the weight without lifting elbows.','Pause briefly near the top.','Lower slowly without snapping elbows straight.'],voice:'Keep arms on the pad. Curl smoothly. Lower with control.'}
};
export function speakCoach(text:string){if(typeof window==='undefined'||!('speechSynthesis' in window))return false;window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(text);voice.rate=0.92;voice.lang='en-US';window.speechSynthesis.speak(voice);return true;}
export function DailyCoach(){const[dismiss,setDismiss]=useState(false);const phrase=phraseOfDay();return <section className="card p-4 mt-4" aria-label="Daily motivation"><div className="eyebrow">28-DAY MOTIVATION · TODAY</div><p className="text-xl font-bold mt-2">{phrase}</p><p className="text-xs soft mt-2">A new positive message each day. Audio plays only when you request it.</p><div className="flex gap-2 mt-3"><button type="button" className="btn" onClick={()=>{if(!speakCoach(phrase))setDismiss(true)}}>▶ LISTEN TO COACH</button><button type="button" className="btn-secondary" onClick={()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();setDismiss(false)}}>STOP</button></div>{dismiss&&<p className="text-xs soft mt-2">Voice playback is unavailable in this browser.</p>}</section>}
export function ReadinessCheck({onApply}:{onApply?:(value:ReturnType<typeof assessReadiness>)=>void}){const[energy,setEnergy]=useState(3),[sleep,setSleep]=useState(3),[soreness,setSoreness]=useState(2),[pain,setPain]=useState(false),[result,setResult]=useState<ReturnType<typeof assessReadiness>|null>(null);const scale=(label:string,val:number,set:(n:number)=>void)=> <label className="block text-sm mt-3">{label}: <strong>{val}/5</strong><input aria-label={label} className="w-full mt-2 accent-orange" type="range" min="1" max="5" value={val} onChange={e=>set(Number(e.target.value))}/></label>;
return <section className="card p-4 mb-4" aria-label="Pre-workout check-in"><div className="eyebrow">BEFORE YOU TRAIN</div><h3 className="text-2xl font-bold uppercase mt-1">How are you feeling?</h3><p className="text-xs soft mt-1">One is low, five is high. Your answers stay on this screen and are not a diagnosis.</p>{scale('Energy',energy,setEnergy)}{scale('Sleep quality',sleep,setSleep)}{scale('Muscle soreness',soreness,setSoreness)}<label className="flex gap-2 items-center mt-3 text-sm"><input type="checkbox" checked={pain} onChange={e=>setPain(e.target.checked)}/> I have pain or discomfort today</label><button type="button" className="btn mt-4 w-full" onClick={()=>{const value=assessReadiness({energy,sleep,soreness,pain});setResult(value);onApply?.(value)}}>CHECK TODAY'S INTENSITY</button>{result&&<div aria-live="polite" className="mt-4 border-t border-zinc-700 pt-3"><p className="text-orange font-bold">{result.level}</p><p className="text-sm soft mt-1">{result.detail}</p><p className="text-xs soft mt-2">Suggested training volume: {Math.round(result.volume*100)}% of normal. This is a starting suggestion, not an automatic change to logged sets.</p></div>}</section>}
export function ExerciseGuide({exercise}:{exercise:string}){const g=GUIDES[exercise];if(!g)return null;return <section className="card p-4 mt-3" aria-label={exercise+' instructions'}><div className="eyebrow">EXERCISE GUIDE · PHOTOS COMING LATER</div><h3 className="text-xl font-bold mt-1">{exercise}</h3><p className="soft text-xs mt-1">Targets: {g.muscles}</p><ol className="list-decimal pl-5 text-sm space-y-2 mt-3">{g.steps.map((s,i)=><li key={i}>{s}</li>)}</ol><div className="flex gap-2 mt-4"><button type="button" className="btn-secondary" onClick={()=>speakCoach(g.voice)}>▶ HEAR FORM TIPS</button><button type="button" className="btn-secondary" onClick={()=>{'speechSynthesis' in window&&window.speechSynthesis.cancel()}}>STOP</button></div></section>}
