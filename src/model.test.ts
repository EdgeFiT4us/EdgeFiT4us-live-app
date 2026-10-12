import {describe,it,expect} from 'vitest';
import {volume,performance,prs,achievement,weekCount,type Workout} from './model';
const a:Workout={id:'a',date:'2026-10-05',notes:'',sets:[{id:'a1',exercise:'Press',weight:80,reps:10,at:''}]};
const b:Workout={id:'b',date:'2026-10-12',notes:'',sets:[{id:'b1',exercise:'Press',weight:85,reps:10,at:''}]};
describe('verified workout calculations',()=>{
 it('counts volume',()=>expect(volume(a)).toBe(800));
 it('computes performance',()=>expect(performance(b,'Press')).toEqual({top:85,volume:850,sets:1}));
 it('finds real PR',()=>expect(prs([a,b]).get('Press')?.weight).toBe(85));
 it('celebrates improvement only with a prior session',()=>{expect(achievement([a,b],b,'Press')).toMatch(/NEW|top weight|85 lb/);expect(achievement([b],b,'Press')).toBe(null)});
 it('does not count demo workout streaks',()=>expect(weekCount([{...b,demo:true}],new Date('2026-10-12T12:00:00'))).toBe(0));
});
