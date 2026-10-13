import {describe,it,expect} from 'vitest';
import {reconcileHistory} from './cloudHistory';
import type {Workout} from './model';
const a:Workout={id:'a',date:'2026-10-13',notes:'Original',sets:[]};
describe('cloud history conflict protection',()=>{
 it('preserves other-device workouts when adding a local workout',()=>expect(reconcileHistory([a],[a,{...a,id:'b'}],[a,{...a,id:'c'}])).toEqual([a,{...a,id:'c'},{...a,id:'b'}]));
 it('refuses to overwrite a conflicting workout',()=>expect(()=>reconcileHistory([a],[{...a,notes:'Local'}],[{...a,notes:'Remote'}])).toThrow(/another device/));
 it('supports deliberate local deletes while retaining remote additions',()=>expect(reconcileHistory([a],[],[a,{...a,id:'b'}])).toEqual([{...a,id:'b'}]));
 it('does not sync demo/test-only data',()=>expect(reconcileHistory([], [{...a,demo:true},{...a,id:'test',testOnly:true}],[])).toEqual([]));
});
