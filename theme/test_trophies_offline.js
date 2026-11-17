const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'theme.js'),'utf8');
const start=source.indexOf('  function trophyValue('),end=source.indexOf('  var NP_SUFFIXES =',start);
assert(start>=0 && end>start);
function harness(){
  let now=0,id=0;const timers=new Map(),logs=[],T={done:{}};
  const methods=new Function('T','APP','THEME','log','setTimeout','clearTimeout','globalThis','hubTitleId','fetchTrophies','Date',
    source.slice(start,end)+'\nreturn {trophyOfflineFetcher,trophyErrorText,trophyFetcher,trophyGameNames};')(
      T,'hub',{fakeTrophies:true},s=>logs.push(s),
      (fn,ms)=>{timers.set(++id,{fn,time:now+ms});return id;},n=>timers.delete(n),{},()=>'',()=>{}, {now:()=>now});
  return {...methods,T,timers,logs,advance(ms){now+=ms;for(const [n,t]of [...timers])if(t.time<=now){timers.delete(n);t.fn();}}};
}
async function flush(){for(let i=0;i<80;i++)await Promise.resolve();}
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}
function native(overrides={}){
  const calls=[];
  const api={
    createAccessor:()=>0, deleteAccessor:()=>{},
    isOnlineModeAvailable(){throw Error('online capability must not be queried');},
    getPlayedTitleIdListByNpTitleId:()=>['local-title'],getTitleIdListByNpTitleId:()=>['local-title'],
    getTitleConf:()=>({numPlatinum:1,numGold:3,numSilver:14,numBronze:20}),
    getTitleRecord:()=>({numUnlockedPlatinum:0,numUnlockedGold:2,numUnlockedSilver:4,numUnlockedBronze:8,progress:37}),
    ...overrides
  };
  for(const name of Object.keys(api)){const fn=api[name];api[name]=function(args){assert.equal(this,api);calls.push([name,args]);return fn(args);};}
  return {api,calls};
}
async function main(){
  // Native Trophies resolves Account.getInfo({userId}) before reading the
  // current user's offline records. A 64-bit decimal ID must stay a string.
  {
    const h=harness(),accountId='18446744073709551614',accountCalls=[];
    const account={getInfo(p){assert.equal(this,account);accountCalls.push(p);return {accountId};}};
    const n=native({
      getPlayedTitleIdListByNpTitleId:p=>p.accountId===accountId?['played-set']:[],
      getTitleIdListByNpTitleId:()=>[],
      getTitleRecord:p=>p.accountId===accountId?{numUnlockedPlatinum:0,numUnlockedGold:0,numUnlockedSilver:1,numUnlockedBronze:4,progress:8}:{}
    });
    const required=[];
    h.T.require=id=>{required.push(id);
      if(id===2578)return {fetchTitleData(){throw Error('stock service called');}};
      if(id===210)return {TrophyAccessor:n.api};
      if(id===8)return {User:{launchedUser:7}};
      if(id===1009)return {Account:account};
      throw Error('unexpected factory '+id);
    };h.T.require.c={};
    const data=await h.trophyFetcher().fn({npTitleId:'PPSA02530_00'});
    assert.deepEqual(accountCalls,[{userId:7}]);assert(required.includes(1009));
    assert.equal(data.progress,8);assert.deepEqual(data.earnedTrophies,{platinum:0,gold:0,silver:1,bronze:4});
    for(const [method,params]of n.calls)if(method==='getPlayedTitleIdListByNpTitleId'||method==='getTitleRecord')assert.equal(params.accountId,accountId);
    assert.equal(n.calls.at(-1)[0],'deleteAccessor');assert.equal(h.timers.size,0);
  }
  // A provided account is respected, and native IDs are isolated by user.
  {
    const h=harness(),seen=[],n=native();
    const account={getInfo:({userId})=>{seen.push(userId);return {accountId:userId===7?'9007199254740993':'9007199254740995'};}};
    const fetch=h.trophyOfflineFetcher(n.api,{launchedUser:7},account);
    await fetch({npTitleId:'PPSA00001_00'});await fetch({npTitleId:'PPSA00002_00',userId:8});
    await fetch({npTitleId:'PPSA00003_00',accountId:'123'});
    assert.deepEqual(seen,[7,8]);
    assert.deepEqual(n.calls.filter(c=>c[0]==='getTitleRecord').map(c=>c[1].accountId),['9007199254740993','9007199254740995','123']);
  }
  // Unsupported/invalid account information retains Sony's 'me' fallback;
  // numbers are not accepted because precision may already have been lost.
  for(const info of [{},{accountId:9007199254740992},{accountId:'0'},{accountId:'invalid'}]){
    const h=harness(),n=native();
    await h.trophyOfflineFetcher(n.api,{launchedUser:1},{getInfo:()=>info})({npTitleId:'PPSA00001_00'});
    assert.equal(n.calls.find(c=>c[0]==='getTitleRecord')[1].accountId,'me');assert.equal(h.timers.size,0);
  }
  // A pending identity request expires before the queue watchdog; a late
  // identity reply cannot change the account of an in-flight native read.
  {
    const h=harness(),n=native(),r=deferred();
    const result=h.trophyOfflineFetcher(n.api,{launchedUser:1},{getInfo:()=>r.promise})({npTitleId:'PPSA00001_00'});
    await flush();assert.equal(n.calls.length,0);
    h.advance(600);await flush();await result;
    assert.equal(n.calls.find(c=>c[0]==='getTitleRecord')[1].accountId,'me');
    const count=n.calls.length;r.resolve({accountId:'9007199254740993'});await flush();assert.equal(n.calls.length,count);
    assert.equal(h.timers.size,0);
  }
  // Reproduce the affected played title with nonzero local records. The
  // stock service chooses its own online mode and is deliberately unusable.
  {
    const h=harness(),n=native();
    h.T.require=id=>{
      if(id===2578)return {fetchTitleData(){throw Error('stock online chooser called');}};
      if(id===210)return {TrophyAccessor:n.api};
      if(id===8)return {User:{launchedUser:452565539}};
      throw Error('unexpected module '+id);
    };h.T.require.c={};
    const provider=h.trophyFetcher();assert.equal(provider.label,'TrophyAccessor (offline)');
    const data=await provider.fn({npTitleId:'PPSA02530_00'});
    assert.deepEqual(data.earnedTrophies,{platinum:0,gold:2,silver:4,bronze:8});assert.equal(data.progress,37);
    assert.deepEqual(n.calls[0],['createAccessor',{userId:452565539,mode:'offline'}]);
    assert.deepEqual(n.calls.find(x=>x[0]==='getTitleRecord')[1],{accessorId:0,titleId:'local-title',accountId:'me'});
    assert.equal(n.calls.filter(x=>x[0]==='deleteAccessor').length,1);
    assert.equal(h.timers.size,0);
  }
  // Real failures retain their nested native code and always close the handle.
  {
    const h=harness(),n=native({getTitleRecord(){throw Object.assign(Error('TrophyHelperError'),{error:{code:'TEST_NATIVE_FAILURE',errorMessage:'record failure'}});}});
    await assert.rejects(h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'}),/getTitleRecord.*TEST_NATIVE_FAILURE/);
    assert.equal(n.calls.filter(x=>x[0]==='deleteAccessor').length,1);assert.equal(h.timers.size,0);
  }
  // A stale first mapping must not hide an available record in a later mapping.
  {
    const h=harness(),n=native({getPlayedTitleIdListByNpTitleId:()=>['old','local-title'],getTitleConf:p=>{if(p.titleId==='old')throw Error('stale title');return {numPlatinum:1,numGold:3};}});
    const data=await h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'});
    assert.equal(data.earnedTrophies.gold,2);assert.equal(n.calls.filter(x=>x[0]==='deleteAccessor').length,1);
  }
  // An unplayed title can expose definitions and actual zero counts.
  {
    const h=harness(),n=native({getPlayedTitleIdListByNpTitleId:()=>[],getTitleRecord:()=>({numUnlockedPlatinum:0,numUnlockedGold:0,numUnlockedSilver:0,numUnlockedBronze:0,progress:0})});
    const data=await h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA11386_00'});
    assert.equal(data.earnedTrophies.gold,0);assert.equal(data.definedTrophies.gold,3);
    assert(n.calls.some(x=>x[0]==='getTitleIdListByNpTitleId'));
  }
  // A timed-out read releases the handle; its late reply cannot reopen work.
  {
    const h=harness(),r=deferred(),n=native({getTitleRecord:()=>r.promise});
    const result=h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'});
    const rejected=assert.rejects(result,/getTitleRecord: timeout/);
    await flush();h.advance(1200);await flush();await rejected;
    assert.equal(n.calls.filter(x=>x[0]==='deleteAccessor').length,1);
    r.resolve({numUnlockedGold:999});await flush();assert.equal(n.calls.filter(x=>x[0]==='deleteAccessor').length,1);
    assert.equal(h.timers.size,0);
  }
  // Even a handle allocated after create timed out must be cleaned up (0 is valid).
  {
    const h=harness(),r=deferred(),n=native({createAccessor:()=>r.promise});
    const result=h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'});
    const rejected=assert.rejects(result,/createAccessor: timeout/);
    await flush();h.advance(1200);await flush();await rejected;
    r.resolve(0);await flush();assert.deepEqual(n.calls.at(-1),['deleteAccessor',{accessorId:0}]);assert.equal(h.timers.size,0);
  }
  // Cleanup failure must not discard successfully read earned trophies.
  {
    const h=harness(),r=deferred(),n=native({deleteAccessor:()=>r.promise});
    const result=h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'});
    await flush();h.advance(500);await flush();assert.equal((await result).earnedTrophies.gold,2);
    assert(h.logs.some(x=>x.includes('deleteAccessor: timeout')));assert.equal(h.timers.size,0);
  }
  // Missing records must remain errors, rather than fabricated zero achievements.
  {
    const h=harness(),n=native({getTitleRecord:()=>({})});
    await assert.rejects(h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'}),/no earned counts/);
    assert.equal(n.calls.filter(x=>x[0]==='deleteAccessor').length,1);
    const cycle={message:'TrophyHelperError',error:{code:'TEST_CODE'}};cycle.error.cause=cycle;
    assert(h.trophyErrorText(cycle).includes('TEST_CODE'));
  }
  // The real affected case: both NP mappings are empty, but the native
  // Trophies catalog contains the PS5 record shown in the user's screenshot.
  const conf={titleId:'20:NPWR99999_00',name:'Прагмата',platforms:['prospero'],numGold:4,numSilver:10,numBronze:23};
  function catalogNative(rows, overrides={}){
    const events=[];
    const cursor={read(limit){assert.equal(this,cursor);assert.equal(limit,10000);events.push('read');return rows;},close(){assert.equal(this,cursor);events.push('close');}};
    const n=native({getPlayedTitleIdListByNpTitleId:()=>[],getTitleIdListByNpTitleId:()=>[],
      getTitleConfList:()=>cursor,getTitleConf:p=>{assert.equal(p.titleId,conf.titleId);return conf;},
      getTitleRecord:p=>{assert.equal(p.titleId,conf.titleId);return {numUnlockedPlatinum:0,numUnlockedGold:0,numUnlockedSilver:1,numUnlockedBronze:4,progress:8};},
      ...overrides});
    return {...n,events,cursor};
  }
  function metadata(h){
    h.trophyGameNames(JSON.stringify([{id:'PPSA02530',name:'PRAGMATA'},{id:'PPSA00002',name:'Other game'}]));
    h.trophyGameNames(JSON.stringify([{id:'PPSA02530',name:'Прагмата'}]));
  }
  // Exact build 383 console reproduction: Home supplies only PRAGMATA;
  // the native PS5 catalog calls the set Прагмата. This failed with 0
  // matches before canonicalizing the reviewed language pair.
  {
    const h=harness();h.trophyGameNames(JSON.stringify([{id:'PPSA02530',name:'PRAGMATA'}]));
    const n=catalogNative([conf]);
    const data=await h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'});
    assert.equal(data.progress,8);assert.deepEqual(data.earnedTrophies,{platinum:0,gold:0,silver:1,bronze:4});
    assert.equal(n.calls.find(c=>c[0]==='getTitleRecord')[1].titleId,conf.titleId);
  }
  // Publisher-localized names support translations unrelated to English
  // spelling; matching uses metadata aliases, not transliteration or fuzzing.
  {
    const h=harness();
    h.trophyGameNames(JSON.stringify([{id:'PPSA02530',name:'English game',names:['English game','Совсем другое название']} ]));
    const n=catalogNative([{...conf,name:'Совсем другое название'}]);
    assert.equal((await h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'})).progress,8);
    assert.deepEqual(h.T.trophyNames.PPSA02530,['English game','Совсем другое название']);
  }
  // Two independently installed PS5 stacks with the reviewed translated
  // name remain ambiguous, even if only one happens to have earned trophies.
  {
    const h=harness();h.trophyGameNames(JSON.stringify([{id:'PPSA02530',name:'PRAGMATA'}]));
    const n=catalogNative([conf,{...conf,titleId:'20:NPWR88888_00',name:'Pragmata'}]);
    await assert.rejects(h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'}),/catalog: 2 matches/);
    assert(!n.calls.some(c=>c[0]==='getTitleRecord'));
  }
  {
    const h=harness();metadata(h);
    const n=catalogNative([{...conf,titleId:'10:NPWR99999_00',platforms:['ps4']},conf]);
    const fetch=h.trophyOfflineFetcher(n.api,{launchedUser:452565539});
    const data=await fetch({npTitleId:'PPSA02530_00'});
    assert.deepEqual(data.earnedTrophies,{platinum:0,gold:0,silver:1,bronze:4});assert.equal(data.progress,8);
    assert.deepEqual(n.events,['read','close']);assert.equal(n.calls.at(-1)[0],'deleteAccessor');
    await fetch({npTitleId:'PPSA02530'});
    assert.equal(n.calls.filter(c=>c[0]==='getTitleConfList').length,1,'reuse definitions, not earned counts');
    assert.equal(n.calls.filter(c=>c[0]==='getTitleRecord').length,2);
    await fetch({npTitleId:'PPSA02530',userId:7});
    assert.equal(n.calls.filter(c=>c[0]==='getTitleConfList').length,2,'catalog is scoped to user');
    assert.equal(h.timers.size,0);
  }
  // Wrong platform, a similar name, and two PS5 sets must never select a
  // convenient record merely because it has earned trophies.
  for(const rows of [
    [{...conf,platforms:['ps4']}],
    [{...conf,name:'Прагмата Demo'}],
    [conf,{...conf,titleId:'20:NPWR88888_00'}]
  ]){
    const h=harness();metadata(h);const n=catalogNative(rows);
    await assert.rejects(h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'}),/catalog: [02] matches/);
    assert(!n.calls.some(c=>c[0]==='getTitleRecord'));assert.deepEqual(n.events,['read','close']);
    assert.equal(n.calls.at(-1)[0],'deleteAccessor');assert.equal(h.timers.size,0);
  }
  // A stuck catalog read closes its cursor before releasing the accessor.
  {
    const h=harness();metadata(h);const r=deferred(),n=catalogNative([]);
    n.cursor.read=()=>r.promise;
    const result=h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'});
    const rejected=assert.rejects(result,/read: timeout/);
    await flush();h.advance(1200);await flush();await rejected;
    assert.deepEqual(n.events,['close']);assert.equal(n.calls.at(-1)[0],'deleteAccessor');
    r.resolve([conf]);await flush();assert(!n.calls.some(c=>c[0]==='getTitleRecord'));assert.equal(h.timers.size,0);
  }
  // A catalog cursor created after its timeout is still closed once.
  {
    const h=harness();metadata(h);const r=deferred(),n=catalogNative([], {getTitleConfList:()=>r.promise});
    const result=h.trophyOfflineFetcher(n.api,{launchedUser:1})({npTitleId:'PPSA02530_00'});
    const rejected=assert.rejects(result,/getTitleConfList: timeout/);
    await flush();h.advance(1200);await flush();await rejected;
    r.resolve(n.cursor);await flush();assert.deepEqual(n.events,['close']);assert.equal(h.timers.size,0);
  }
  console.log('Offline trophy tests passed: native account identity, 64-bit IDs, earned records, catalog fallback, isolation, cleanup, timeouts and late replies.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
