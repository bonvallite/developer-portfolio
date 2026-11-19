import test from 'node:test';
import assert from 'node:assert/strict';
import { getRewardProgress, getEligibleGifts, simulateFlow, validateThresholds } from '../lib/spend-save-rules.mjs';

for (const [subtotal, first, shipping, final] of [
  [0,false,false,false],[149,false,false,false],[150,true,false,false],
  [199,true,false,false],[200,true,true,false],[299,true,true,false],
  [300,true,true,true],[500,true,true,true],
]) {
  test('threshold eligibility at A$'+subtotal, () => {
    const p = getRewardProgress(subtotal);
    assert.equal(p.firstGiftUnlocked,first);
    assert.equal(p.freeShippingUnlocked,shipping);
    assert.equal(p.finalGiftUnlocked,final);
    assert.ok(p.percentage >= 0 && p.percentage <= 100);
  });
}
test('gift lines are not added before the first threshold',()=>assert.deepEqual(getEligibleGifts(149),[]));
test('two patties are awarded at first threshold',()=>assert.deepEqual(getEligibleGifts(150),[{sku:'DEMO-PATTIES',quantity:2,price:0}]));
test('final tier adds both gift types without changing prices',()=>{
  assert.deepEqual(getEligibleGifts(300),[{sku:'DEMO-PATTIES',quantity:2,price:0},{sku:'DEMO-RIB-FILLET',quantity:1,price:0}]);
});
test('no email before payment',()=>assert.equal(simulateFlow({subtotal:300,paid:false}).email,false));
test('no duplicate email or gifts for processed order',()=>assert.deepEqual(simulateFlow({subtotal:300,paid:true,processed:true}),{status:'already-processed',gifts:[],email:false}));
test('failed order edit must not send success email',()=>assert.deepEqual(simulateFlow({subtotal:300,paid:true,commitSucceeded:false}),{status:'edit-failed',gifts:[],email:false}));
test('successful eligible paid order permits confirmation',()=>assert.equal(simulateFlow({subtotal:300,paid:true}).email,true));
test('reject malformed thresholds',()=>assert.throws(()=>validateThresholds({first:300,shipping:200,final:150}),RangeError));
test('reject invalid subtotal',()=>assert.throws(()=>getRewardProgress(-1),RangeError));
