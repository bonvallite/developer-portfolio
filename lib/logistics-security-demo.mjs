
/** Browser/Node Web Crypto laboratory. All keys are public teaching fixtures,
 * never usable merchant credentials. OAuth, KV and HTTP are in-memory models,
 * not a production authentication implementation or network transport. */
const encoder=new TextEncoder();
const fixtureKey=encoder.encode(['JRV','PUBLIC','HMAC','DEMO'].join('-'));
const bytesToHex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
const hexToBytes=hex=>Uint8Array.from(hex.match(/.{2}/g)??[],v=>parseInt(v,16));
const bytesToBase64=bytes=>btoa(String.fromCharCode(...bytes));
const equal=(a,b)=>{let difference=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)difference|=(a[i]??0)^(b[i]??0);return difference===0;};
async function keyForDemo(){return crypto.subtle.importKey('raw',fixtureKey,{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
export async function signFixture(message){
 if(typeof message!=='string'||message.length>16000)throw new Error('Use a demo body of up to 16,000 characters.');
 return new Uint8Array(await crypto.subtle.sign('HMAC',await keyForDemo(),encoder.encode(message)));
}
export async function verifyFixture(message,hex){
 if(typeof message!=='string'||message.length>16000||typeof hex!=='string'||!/^[a-f0-9]{64}$/i.test(hex))return false;
 return crypto.subtle.verify('HMAC',await keyForDemo(),hexToBytes(hex),encoder.encode(message));
}
export const SECURITY_MODES=[
 {id:'webhook',label:'Shopify webhook / HMAC',scenarios:[['valid','Valid signature'],['tampered','Tampered raw body'],['missing','Missing signature']]},
 {id:'oauth',label:'OAuth installation / KV',scenarios:[['valid','Valid callback'],['state','State mismatch'],['cookie','Cookie mismatch'],['expired','Expired state'],['hmac','Invalid callback HMAC'],['replay','Replayed callback'],['scope','Missing required scope']]},
 {id:'basic',label:'Carrier webhook / Basic Auth',scenarios:[['valid','Valid demo header'],['invalid','Wrong demo credential'],['missing','Missing header']]},
 {id:'bearer',label:'Admin retry / Bearer',scenarios:[['valid','Valid demo header'],['invalid','Wrong demo credential'],['missing','Missing header']]}
];
/** Fake OAuth state store: expiry and consume-on-success semantics illustrate
 * single use, not atomicity or the consistency guarantees of distributed KV. */
export async function runSecurityDemo({mode='webhook',scenario='valid',body='{"reference":"DEMO-001","topic":"orders/create"}'}={}){
 const config=SECURITY_MODES.find(m=>m.id===mode);
 if(!config||!config.scenarios.some(s=>s[0]===scenario))throw new Error('Unknown demo scenario.');
 const steps=[];
 const add=(title,from,to,input,output,status='success')=>steps.push({id:steps.length+1,title,from,to,input,output,status});
 const stop=(reason,http=401)=>({steps,accepted:false,http,reason,credentialStored:false,externalRequests:0});
 const done=(credentialStored=false)=>({steps,accepted:true,http:200,reason:'DEMO_ACCEPTED',credentialStored,externalRequests:0});
 if(mode==='webhook'){
  const signature=await signFixture(body), signedHex=bytesToHex(signature);
  const received=scenario==='tampered'?body+' ':body;
  add('Sign original raw bytes','client','worker',{algorithm:'HMAC-SHA256',body},{signatureBase64:bytesToBase64(signature),signatureHex:signedHex});
  const supplied=scenario==='missing'?'':signedHex;
  const valid=await verifyFixture(received,supplied);
  add('Verify received raw bytes','worker','worker',{body:received,signaturePresent:Boolean(supplied)},{valid,http:valid?200:401},valid?'success':'failed');
  if(!valid)return stop(supplied?'SIGNATURE_MISMATCH':'MISSING_SIGNATURE');
  add('Allow business logic','worker','api',{verified:true},{authorisedDemoDispatch:true});
  return done();
 }
 if(mode==='oauth'){
  // A fixed virtual clock makes the ten-minute TTL boundary reproducible.
  const start=0,ttl=600,state='DEMO-STATE',shop='example.invalid';
  const kv=new Map([[state,{shop,expiresAt:start+ttl}]]);
  add('Begin app installation','client','worker',{shop},{redirect:'mock consent screen',state,secureCookie:'simulated state cookie'});
  add('Persist short-lived state','worker','kv',{key:state,ttlSeconds:ttl},{stored:true});
  const queryState=scenario==='state'?'WRONG':state;
  const callback='code=DEMO-CODE&shop='+shop+'&state='+queryState;
  const signature=bytesToHex(await signFixture(callback));
  add('Return authorisation callback','api','worker',{query:callback},{callbackReceived:true});
  const hmacOk=await verifyFixture(callback,scenario==='hmac'?'0'.repeat(64):signature);
  add('Verify callback HMAC','worker','worker',{canonicalQuery:callback},{valid:hmacOk},hmacOk?'success':'failed');
  if(!hmacOk)return stop('CALLBACK_HMAC_MISMATCH',403);
  const cookie=scenario==='cookie'?'WRONG':state,now=scenario==='expired'?600:120;
  const entry=kv.get(queryState);
  const stateOk=Boolean(entry&&entry.shop===shop&&cookie===queryState&&now<entry.expiresAt);
  add('Verify state, cookie and TTL','worker','kv',{queryState,cookie,elapsedSeconds:now},{valid:stateOk,ttlSeconds:ttl},stateOk?'success':'failed');
  if(!stateOk)return stop(scenario==='expired'?'STATE_EXPIRED':'STATE_OR_COOKIE_MISMATCH',403);
  kv.delete(queryState);
  add('Consume state once','worker','kv',{key:queryState},{remaining:kv.size});
  if(scenario==='replay'){
    const replayAccepted=kv.has(queryState);
    add('Reject repeated callback','api','worker',{queryState},{accepted:replayAccepted},'failed');
    return stop('STATE_ALREADY_CONSUMED',403);
  }
  add('Exchange authorisation code (mock)','worker','api',{code:'DEMO-CODE'},{offlineGrant:true,scope:scenario==='scope'?['read_orders']:['read_orders','write_orders']});
  const scoped=scenario!=='scope';
  add('Check example required permission','worker','worker',{required:'write_orders'},{valid:scoped},scoped?'success':'failed');
  if(!scoped)return stop('MISSING_EXAMPLE_SCOPE',403);
  add('Persist masked offline grant (mock)','worker','kv',{shop,grant:'[DEMO ONLY]'},{stored:true,offline:true});
  add('Authorise later mock API request','worker','api',{grantPresent:true},{accepted:true});
  return done(true);
 }
 // Demonstrates local comparison of synthetic header values. Never parse or
 // transmit visitor credentials; actual server security is out of scope.
 const expected=mode==='basic'?'Basic '+btoa(['demo','public'].join(':')):'Bearer '+['DEMO','PUBLIC'].join('-');
 const supplied=scenario==='missing'?'':scenario==='invalid'?expected+'x':expected;
 add('Receive protected request','client','worker',{scheme:mode==='basic'?'Basic':'Bearer',headerPresent:Boolean(supplied)},{received:true});
 const valid=equal(encoder.encode(expected),encoder.encode(supplied));
 add('Compare demo authorisation','worker','worker',{header:'[DEMO FIXTURE]',present:Boolean(supplied)},{valid,http:valid?200:401},valid?'success':'failed');
 if(!valid)return stop(supplied?'AUTHORISATION_MISMATCH':'MISSING_AUTHORISATION');
 add(mode==='basic'?'Allow carrier event':'Allow admin retry','worker','api',{authorised:true},{mockOnly:true});
 return done();
}
