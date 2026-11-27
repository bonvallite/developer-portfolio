
import test from 'node:test';
import assert from 'node:assert/strict';
import {runSecurityDemo,signFixture,verifyFixture,SECURITY_MODES} from '../lib/logistics-security-demo.mjs';
test('Web Crypto verifies exact bytes, not modified whitespace',async()=>{
 const raw='{"reference":"DEMO-001"}';
 const signature=Buffer.from(await signFixture(raw)).toString('hex');
 assert.equal(signature.length,64);assert.equal(await verifyFixture(raw,signature),true);
 assert.equal(await verifyFixture(raw+' ',signature),false);
 assert.equal(await verifyFixture(raw,'invalid'),false);
});
test('all 16 documented scenario choices stop or accept appropriately',async()=>{
 assert.equal(SECURITY_MODES.reduce((n,m)=>n+m.scenarios.length,0),16);
 for(const m of SECURITY_MODES)for(const [scenario] of m.scenarios){
  const r=await runSecurityDemo({mode:m.id,scenario});
  assert.equal(r.accepted,scenario==='valid',m.id+'/'+scenario);
  assert.equal(r.externalRequests,0);
  assert.equal(r.credentialStored,m.id==='oauth'&&scenario==='valid');
  if(!r.accepted)assert.equal(r.steps.at(-1).status,'failed');
 }
});
test('OAuth expiry and replay do not perform mock code exchange',async()=>{
 for(const scenario of ['expired','replay','state','cookie','hmac']){
  const r=await runSecurityDemo({mode:'oauth',scenario});
  assert.equal(r.http,403);assert.ok(!r.steps.some(s=>s.title.startsWith('Exchange')));
 }
 const r=await runSecurityDemo({mode:'oauth',scenario:'scope'});
 assert.equal(r.reason,'MISSING_EXAMPLE_SCOPE');assert.equal(r.credentialStored,false);
});
test('reject unknown scenario and oversized input',async()=>{
 await assert.rejects(runSecurityDemo({mode:'unknown'}));
 await assert.rejects(signFixture('x'.repeat(16001)));
});
