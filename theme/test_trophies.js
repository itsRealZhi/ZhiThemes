const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, 'theme.js'), 'utf8');
new Function(src); // syntax check without running the Home hooks
const start = src.indexOf('  function trophyValue('), end = src.indexOf("  var NP_SUFFIXES =", start);
if (start < 0 || end < start) throw Error('trophy helpers missing');
const T = {}, callbacks = [], requests = [];
const api = new Function('T','APP','THEME','log','setTimeout','globalThis','hubTitleId','fetchTrophies',
  src.slice(start,end) + '\nreturn {trophyValue,cachedTrophies,trophyFetchExport,observeTrophyFetch,trophyFetcher,waitForTrophyFetcher};'
)(T,'hub',{fakeTrophies:true},()=>{},f=>callbacks.push(f),
  {__themeTrophyAsk:ids=>requests.push(ids)},()=>'PPSA00001',()=>{});

function assert(ok,message){if(!ok)throw new Error(message);}
function fetchTrophyProgressData(){return Promise.resolve({earnedTrophies:{gold:1}});}
const cases=[
 [{fetchTrophyProgressData: function anonymous(){}},false],
 [{default:fetchTrophyProgressData},false],
 [{default:{fetchTrophyProgressData}},false],
 [{default:{default:fetchTrophyProgressData}},true],
];
for(const [value,legacy] of cases)assert(api.trophyFetchExport(value,legacy),'export shape');
assert(!api.trophyFetchExport({default:function Unrelated(){}},false),'unrelated module rejected');
const cyclic={};cyclic.default=cyclic;
assert(!api.trophyFetchExport(cyclic,false),'cyclic exports bounded');
const unsafe={};Object.defineProperty(unsafe,'broken',{enumerable:true,get(){throw Error('getter');}});
assert(!api.trophyFetchExport(unsafe,false),'throwing getters ignored');
T.require=function(){throw Error('wrong module 2559');};
T.require.c={8123:{exports:{fetchTrophyProgressData}}};
assert(api.trophyFetcher().fn===fetchTrophyProgressData,'renumbered provider from cache');
delete T.trophyFetcher;delete T.trophyFetchScan;
T.require.c={};T.trophyLegacyChecked=true;
assert(!api.trophyFetcher(),'provider absent');
api.waitForTrophyFetcher('PPSA00001');
api.observeTrophyFetch({fetchTrophyProgressData},9001);
assert(callbacks.length===1,'late provider schedules retry');
callbacks.shift()();
assert(requests[0]==='PPSA00001','late provider replays the requested game');
T.trophyCache={PPSA00001:{id:'PPSA00001',none:true}};
assert(!api.cachedTrophies('PPSA00001'),'empty placeholder is never valid cached data');
T.trophyCache.PPSA00001={id:'PPSA00001',e:[0,1,2,3]};
assert(api.cachedTrophies('PPSA00001'),'successful data remains cached');

const incomingStart = src.indexOf("      if (!THEME.fakeTrophies || (key !== 'trophies'");
const incomingEnd = src.indexOf('\n    };\n', incomingStart);
assert(incomingStart>=0 && incomingEnd>incomingStart,'incoming handler found');
const receive = new Function('T','THEME','log','setTimeout','trophyListeners','cachedTrophies','trophyValue','done',
  'return function(key,text){' + src.slice(incomingStart,incomingEnd) + '\n};'
)(T,{fakeTrophies:true},()=>{},f=>f(),[],api.cachedTrophies,api.trophyValue,()=>{});
T.done={};T.focusedId='PPSA00001';T.trophyCache={};
receive('trophies',JSON.stringify({id:'PPSA00001',none:true}));
assert(!T.trophyCache.PPSA00001,'initial empty reply must not poison the Home cache');
receive('trophies',JSON.stringify({id:'PPSA00001',e:[0,1,2,3],p:10}));
const cached=T.trophyCache.PPSA00001;
receive('trophies',JSON.stringify({id:'PPSA00001',none:true}));
assert(T.trophies===cached,'reload placeholder must not overwrite already available trophies');
// Exercise the real request and queue code with controlled service replies.
function makeHub(service) {
  const state = {done:{},require(){},hubContext:{queryParams:{titleId:'PPSA00001'}},
    trophyFetcher:{fn:service,owner:null}};
  const global = {}, timers = new Map(), messages = [], logs = [], wire = new Map();
  let timerId = 0;
  const first = src.indexOf('  function findTrophies(');
  const last = src.indexOf('  /* the native video / picture', first);
  assert(first >= 0 && last > first, 'request helpers found');
  const methods = new Function('T','APP','THEME','log','setTimeout','clearTimeout',
    'setInterval','globalThis','fromLibrary','done','console',
    src.slice(first,last) + '\nreturn {requestTrophies,fetchTrophies,cachedTrophies,sendTrophyData,sendTrophies,observeTrophyFetch};'
  )(state,'hub',{fakeTrophies:true},m=>logs.push(m),
    (fn,ms)=>{const id=++timerId;timers.set(id,{fn,ms});return id;},
    id=>timers.delete(id),()=>{},global,()=>false,()=>{},
    {log:line=>{const m=/^THEME-DATA (\S+) (.*)$/.exec(line);
      if(m){wire.set(m[1],m[2]);messages.push(JSON.parse(m[2]));}}});
  return {state,global,timers,messages,logs,wire,...methods,
    expire(){const next=timers.entries().next();assert(!next.done,'timer scheduled');
      const [id,t]=next.value;timers.delete(id);t.fn();},
    drain(){let budget=100;while(timers.size && budget-->0)this.expire();
      assert(budget>0,'timers/requests bounded');}};
}
function deferred() {
  let ok, bad;
  return {then(a,b){ok=a;bad=b;},resolve(v){assert(ok,'promise subscribed');ok(v);},
    reject(e){assert(bad,'promise subscribed');bad(e);}};
}
const trophyData = {earnedTrophies:{platinum:0,gold:1,silver:2,bronze:3},
  definedTrophies:{platinum:1,gold:2,silver:4,bronze:8},progress:24};
const immediate = value=>({then:ok=>ok(value)});

// A pending service promise used to keep trophyBusy true indefinitely.
const hung = [], calls = [];
const hub = makeHub(args=>{
  calls.push(args.npTitleId);
  if(args.npTitleId.startsWith('PPSA00001')){
    const p=deferred();hung.push(p);return p;
  }
  return immediate(trophyData);
});
hub.global.__themeTrophyAsk('PPSA00001,PPSA00002');
assert(calls.length===1,'queue starts with the first game');
hub.drain();
assert(hub.messages.some(m=>m.id==='PPSA00002'),'timeout releases the following game');
assert(!hub.cachedTrophies('PPSA00001'),'timeout is not cached as zero trophies');
assert(hub.cachedTrophies('PPSA00002').e[1]===1,'the following game keeps actual trophies');
const beforeLate=hub.messages.length;
hung.forEach(p=>p.resolve(trophyData));
assert(hub.messages.length===beforeLate,'late replies cannot complete an expired request');
assert(hub.logs.some(x=>x.includes('timeout')),'timeout is visible in the diagnostic log');

// Both callers share one in-flight request for the same title. A later
// focus must not relabel that response or suppress the following title.
const firstRequest=deferred(), sharedCalls=[];
const shared=makeHub(args=>{
  sharedCalls.push(args.npTitleId);
  return args.npTitleId.startsWith('PPSA00001')?firstRequest:immediate(trophyData);
});
shared.fetchTrophies('PPSA00001');
shared.global.__themeTrophyAsk('PPSA00001,PPSA00002');
assert(sharedCalls.length===1,'hub and Home share the active title request');
shared.state.hubContext.queryParams.titleId='PPSA00002';
firstRequest.resolve(trophyData);
assert(shared.messages.some(m=>m.id==='PPSA00001'),'response retains its original title');
assert(shared.messages.some(m=>m.id==='PPSA00002'),'shared completion releases the queue');
assert(Object.keys(shared.state.trophyPending).length===0,'all pending slots are released');
assert(shared.timers.size===0,'completed requests clear their watchdogs');

// Missing data, thrown calls, rejections and hostile then accessors all
// advance to the second NP title form and then to the next game.
for(const kind of ['throw','reject','plain','getter']){
  const errors=makeHub(args=>{
    if(args.npTitleId.startsWith('PPSA00002'))return immediate(trophyData);
    if(kind==='throw')throw Error('service error');
    if(kind==='reject')return {then:(ok,bad)=>bad(Error('offline'))};
    if(kind==='getter')return Object.defineProperty({},'then',{get(){throw Error('then getter');}});
    return {status:'not ready'};
  });
  errors.global.__themeTrophyAsk('PPSA00001,PPSA00002');
  errors.drain();
  assert(errors.messages.some(m=>m.id==='PPSA00002'),kind+' does not block the queue');
  assert(!errors.cachedTrophies('PPSA00001'),kind+' does not poison the cache');
}
const alternative=makeHub(args=>args.npTitleId.endsWith('_00')?immediate({}):immediate(trophyData));
alternative.fetchTrophies('PPSA00001');
assert(alternative.messages[0].e[1]===1,'alternate NP title form still works');

// A failing subscriber cannot prevent the other subscriber from releasing
// its queue slot.
const callbackReply=deferred(), callbackHub=makeHub(()=>callbackReply);
let completed=0;
callbackHub.requestTrophies('PPSA00001',()=>{throw Error('subscriber failure');});
callbackHub.requestTrophies('PPSA00001',()=>completed++);
callbackReply.resolve(trophyData);
assert(completed===1,'callback failure does not strand other subscribers');
assert(callbackHub.timers.size===0,'callback failure leaves no watchdog');

// Returning to a game must resend cached progress even if trophyGotFor
// still records it from an earlier hub context.
shared.state.hubContext.queryParams.titleId='PPSA00001';
shared.state.trophyGotFor='PPSA00001';
shared.fetchTrophies('PPSA00001');
assert(shared.messages.at(-1).id==='PPSA00001','revisiting a cached title resends its progress');
assert(sharedCalls.length===2,'revisiting a cached title does not refetch');

// Newly focused titles are processed before old prefetch work.
const blocker=deferred(), order=[];
const priority=makeHub(args=>{
  order.push(args.npTitleId);
  return args.npTitleId.startsWith('PPSA00001')?blocker:immediate(trophyData);
});
priority.global.__themeTrophyAsk('PPSA00001,PPSA00002');
priority.global.__themeTrophyAsk('PPSA00003');
blocker.resolve(trophyData);
assert(order[1].startsWith('PPSA00003'),'current focus takes precedence over stale prefetch');

// A delayed Home notification for A must not replace B after focus changes.
const deferredNotifications=[], received=[], homeState={done:{},focusedId:'PPSA00001'};
const receiveLater = new Function('T','THEME','log','setTimeout','trophyListeners',
  'cachedTrophies','trophyValue','done',
  'return function(key,text){' + src.slice(incomingStart,incomingEnd) + '\n};'
)(homeState,{fakeTrophies:true},()=>{},f=>deferredNotifications.push(f),[v=>received.push(v)],
  id=>homeState.trophyCache&&homeState.trophyCache[id],api.trophyValue,()=>{});
receiveLater('trophies',JSON.stringify({id:'PPSA00001',e:[0,1,2,3]}));
homeState.focusedId='PPSA00002';
receiveLater('trophies',JSON.stringify({id:'PPSA00002',e:[0,0,0,1]}));
deferredNotifications.forEach(f=>f());
assert(received.length===1 && received[0].id==='PPSA00002','stale notification cannot hide current trophies');


assert(shared.wire.has('trophies-PPSA00001') && shared.wire.has('trophies-PPSA00002'),
  'fast replies use independent bridge keys');
const batchedState={done:{},focusedId:'PPSA00001'}, batchedReceived=[];
const receiveBatch = new Function('T','THEME','log','setTimeout','trophyListeners',
  'cachedTrophies','trophyValue','done',
  'return function(key,text){' + src.slice(incomingStart,incomingEnd) + '\n};'
)(batchedState,{fakeTrophies:true},()=>{},f=>f(),[v=>batchedReceived.push(v)],
  id=>batchedState.trophyCache&&batchedState.trophyCache[id],api.trophyValue,()=>{});
for(const [key,value]of shared.wire)receiveBatch(key,value);
assert(batchedState.trophyCache.PPSA00001 && batchedState.trophyCache.PPSA00002,
  'native bridge polling preserves both games in one batch');
assert(batchedReceived.length===1 && batchedReceived[0].id==='PPSA00001',
  'the focused game is shown even when another reply arrives last');


// Native summary data shares the cache; a loading placeholder for the same
// title must not replace progress already held by the bridge.
const native=makeHub(()=>{throw Error('cached native progress should not refetch');});
native.sendTrophies(trophyData,'summary');
native.sendTrophyData({id:'PPSA00001',none:true});
assert(JSON.parse(native.wire.get('trophies-PPSA00001')).e[1]===1,
  'loading placeholder preserves known native progress');
native.fetchTrophies('PPSA00001');
assert(native.timers.size===0,'native summary data avoids a duplicate service call');

// The service may load after the requests. Missing providers release the
// queue, and the observer replays all waiting titles once it appears.
const late=makeHub(()=>{});
delete late.state.trophyFetcher;
late.state.require.c={};
late.global.__themeTrophyAsk('PPSA00001,PPSA00002');
assert(!late.state.trophyPending || !Object.keys(late.state.trophyPending).length,
  'missing provider leaves no stuck pending requests');
late.observeTrophyFetch({fetchTrophyProgressData:()=>immediate(trophyData)},9001);
late.drain();
assert(late.cachedTrophies('PPSA00001') && late.cachedTrophies('PPSA00002'),
  'late provider retries every waiting title');

// Actual 13.20 export layout: the progress wrapper is anonymous in
// 2577; 2559 is unrelated. Its service 2578 has a stable named member.
const localArgs=[], localRequires=[];
const localService={fetchTitleData:function opaque(args){
  assert(this===localService,'local service receiver preserved');
  assert(args && typeof args.npTitleId==='string','local service takes a parameter object');
  assert(args.userId===undefined && args.accountId===undefined,'use the service launched-user defaults');
  localArgs.push(args.npTitleId);
  return immediate(trophyData);
}};
Object.defineProperty(localService.fetchTitleData,'name',{value:''});
const verified=makeHub(()=>{});
delete verified.state.trophyFetcher;
verified.state.require=id=>{localRequires.push(id);
  if(id===2578)return localService;
  if(id===2559)return {default:{unrelated:true}};
  throw Error('unexpected factory '+id);
};
verified.state.require.c={};
verified.global.__themeTrophyAsk('PPSA02530,PPSA00002');
assert(verified.messages.length===2,'local progress is delivered for both games');
assert(verified.messages[0].e[1]===1 && verified.messages[0].p===24,'local earned counts and progress retained');
assert(localArgs.join(',')==='PPSA02530_00,PPSA00002_00','correct NP IDs passed to the verified service');
assert(localRequires.join(',')==='2578,210','verified service and optional native API checked without probing arbitrary factories');
assert(!verified.timers.size,'service completion clears watchdogs');

// The native relay carries current per-ID names in two escaped JSON strings:
// localized Home metadata and the files' default-language names. Focus changes
// and folder prefetch must not attach one game's name to its neighbour.
const named=makeHub(()=>immediate(trophyData));
named.global.__themeTrophyAsk('PPSA02530,PPSA00002',
  JSON.stringify([{id:'PPSA02530',name:'Прагмата'},{id:'PPSA00002',name:'Other "game"'}]),
  JSON.stringify([{id:'PPSA02530',name:'PRAGMATA'}]));
assert(named.state.trophyNames.PPSA02530.join('|')==='Прагмата|PRAGMATA','both language names attached to requested ID');
assert(named.state.trophyNames.PPSA00002[0]==='Other "game"','quoted names preserved');
named.global.__themeTrophyAsk('',JSON.stringify([{id:'PPSA02530',name:'New name'}]),'bad JSON');
assert(named.state.trophyNames.PPSA02530.join('|')==='New name','removed/replaced metadata is not reused');
assert(!named.state.trophyNames.PPSA00002,'old names expire with the metadata snapshot');

// Loading the wrong module shape must never call an arbitrary anonymous
// UI export. Verified legacy 9.60 progress remains available as fallback.
let unrelatedCalls=0, legacyCalls=0;
const legacy=makeHub(()=>{});
delete legacy.state.trophyFetcher;
legacy.state.require=id=>{
  if(id===2578)return {default(){unrelatedCalls++;throw Error('unrelated UI');}};
  if(id===2559)return {default(args){legacyCalls++;return immediate(trophyData);}};
  throw Error('unexpected factory');
};
legacy.state.require.c={};
legacy.fetchTrophies('PPSA00001');
assert(legacyCalls===1 && unrelatedCalls===0,'invalid local service fails closed and keeps legacy support');
assert(legacy.messages[0].e[1]===1,'legacy earned trophies unchanged');

// A service loaded after an earlier failed lookup wakes the waiting games.
const discovered=makeHub(()=>{});
delete discovered.state.trophyFetcher;
discovered.state.require=()=>({default:{}});
discovered.state.require.c={};
discovered.global.__themeTrophyAsk('PPSA02530');
discovered.observeTrophyFetch(localService,2578);
discovered.drain();
assert(discovered.cachedTrophies('PPSA02530').e[1]===1,'late local service retries pending requests');

console.log('Trophy regression tests passed: discovery, caching, timeouts, queue recovery, shared requests, focus order and late replies.');
