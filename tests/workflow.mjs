import assert from 'node:assert/strict';
import {audit,can,defaultRoles,moduleOrder,requirePermission,seed} from '../src/model.ts';

assert.equal(defaultRoles.length,10);
assert.equal(moduleOrder.length,18);
const owner=seed.users.find(user=>user.id==='u-owner');
const cashier=seed.users.find(user=>user.id==='u-cashier');
assert.equal(can(seed,owner,'settings','sensitive'),true);
assert.equal(can(seed,owner,'users','delete'),true);
assert.equal(can(seed,{...cashier,active:true},'payments','create'),true);
assert.equal(can(seed,cashier,'suppliers','view'),false);
assert.equal(can(seed,{...cashier,active:false},'payments','view'),false);
assert.doesNotThrow(()=>requirePermission(seed,owner,'users','edit'));
assert.throws(()=>requirePermission(seed,cashier,'users','edit'),/Permission denied/);
const audited=audit(seed,owner,'Changed permissions','Cashier','sensitive');
assert.equal(audited.audit[0].action,'Changed permissions');
assert.equal(audited.audit[0].level,'sensitive');
console.log('PASS · roles, module/action permissions, inactive denial, guards, audit records');
