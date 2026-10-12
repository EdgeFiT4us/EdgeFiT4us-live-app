import {describe,it,expect} from 'vitest';
import {saveLiveSet,editLiveSet,deleteLiveSet,compareSet,sessionSummary,previousSession,estimatedOneRepMax,finishSession,type LiveWorkout} from './live';
const past:LiveWorkout={id:'old',date:'2026-10-05',notes:'',sets:[{id:'a',exercise:'DB Chest Press',weight:80,reps:10,at:'2026-10-05T15:00:00Z'}]};
const current:LiveWorkout={id:'new',date:'2026-10-12',notes:'',startedAt:'2026-10-12T15:00:00Z',sets:[]};
describe('live workout persistence model',()=>{
 it('saves each set with exact time',()=>{const d=new Date('2026-10-12T15:04:05Z');const v=saveLiveSet(current,'DB Chest Press',85,10,d);expect(v.sets[0].at).toBe(d.toISOString());expect(v.sets.length).toBe(1);expect(current.sets.length).toBe(0)});
 it('edits and deletes incorrect sets',()=>{const w=saveLiveSet(current,'DB Chest Press',85,10);const e=editLiveSet(w,w.sets[0].id,90,8);expect(e.sets[0].weight).toBe(90);expect(deleteLiveSet(e,e.sets[0].id).sets).toHaveLength(0)});
 it('validates inputs',()=>expect(()=>saveLiveSet(current,'DB Chest Press',-1,10)).toThrow());
 it('gives true weight PR',()=>{const w=saveLiveSet(current,'DB Chest Press',85,10);const f=compareSet([past],w,w.sets[0]);expect(f.isPR).toBe(true);expect(f.improvedWeight).toBe(true)});
 it('does not invent PR on weaker set',()=>{const w=saveLiveSet(current,'DB Chest Press',70,8);const f=compareSet([past],w,w.sets[0]);expect(f.isPR).toBe(false)});
 it('recognizes rep and estimated strength',()=>{const w=saveLiveSet(current,'DB Chest Press',80,12);const f=compareSet([past],w,w.sets[0]);expect(f.improvedReps).toBe(true);expect(f.improvedStrength).toBe(true);expect(estimatedOneRepMax(80,12)).toBeGreaterThan(estimatedOneRepMax(80,10))});
 it('excludes demonstration history',()=>expect(previousSession([{...past,demo:true}], 'DB Chest Press','new')).toBeUndefined());
 it('summarizes workout and persists completion timestamp',()=>{const w=saveLiveSet(current,'DB Chest Press',85,10);const end=finishSession(w,new Date('2026-10-12T16:00:00Z'));expect(end.completedAt).toBe('2026-10-12T16:00:00.000Z');expect(sessionSummary(end,[past]).improvements).toEqual(expect.arrayContaining([expect.stringContaining('top weight')]))});
});
