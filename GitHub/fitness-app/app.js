window.addEventListener('error', function(e) {
  document.body.innerHTML += `<div style="position:fixed;inset:0;background:rgba(15,23,42,0.95);color:#f87171;padding:30px;font-family:monospace;z-index:9999;backdrop-filter:blur(10px);overflow:auto;"><b>APP CRASHED:</b><br><br>${e.message}<br><br><i>This usually means one of your component files (like Nav.js or RestTimer.js) is missing its 'import' lines at the very top!</i></div>`;
});
window.addEventListener('unhandledrejection', function(e) {
  document.body.innerHTML += `<div style="position:fixed;inset:0;background:rgba(15,23,42,0.95);color:#f87171;padding:30px;font-family:monospace;z-index:9999;backdrop-filter:blur(10px);overflow:auto;"><b>PROMISE ERROR:</b><br><br>${e.reason}</div>`;
});

import { h, render } from 'https://esm.sh/preact@10.29.0';
import { useState, useEffect } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { dbGetAll, dbPut, drainSyncQueue } from './store.js';
import { SEED_STR, SEED_CAR } from './utils.js';
import { HomeScreen } from './HomeScreen.js';
import { StrengthScreen } from './StrengthScreen.js';
import { CardioScreen } from './CardioScreen.js';
import { PlanScreen } from './PlanScreen.js';
import { ProgressScreen } from './ProgressScreen.js';
import { BodyScreen } from './BodyScreen.js';
import { SyncScreen } from './SyncScreen.js';
import { Nav } from './Nav.js';
import { RestTimer } from './RestTimer.js';

function App(){
  const tabS=useState('home');const tab=tabS[0];const setTab=tabS[1];
  const strS=useState([]);const strSessions=strS[0];const setStrSessions=strS[1];
  const carS=useState([]);const carSessions=carS[0];const setCarSessions=carS[1];
  const readyS=useState(false);const ready=readyS[0];const setReady=readyS[1];
  const uaS=useState(false);const updateAvailable=uaS[0];const setUpdateAvailable=uaS[1];
  const syncMsgS=useState('');const syncMsg=syncMsgS[0];const setSyncMsg=syncMsgS[1];

  useEffect(function(){
    if(navigator&&navigator.storage&&navigator.storage.persist){navigator.storage.persist().catch(function(){});}
    let strL=[],carL=[];
    const p1=dbGetAll('strength').then(function(d){strL=d;}).catch(function(){strL=[];});
    const p2=dbGetAll('cardio').then(function(d){carL=d;}).catch(function(){carL=[];});
    Promise.all([p1,p2]).then(function(){
      if(!strL.length){strL=SEED_STR.slice();return Promise.all(SEED_STR.map(function(s){return dbPut('strength',s);})).catch(function(){});}
    }).then(function(){
      if(!carL.length){carL=SEED_CAR.slice();return Promise.all(SEED_CAR.map(function(s){return dbPut('cardio',s);})).catch(function(){});}
    }).then(function(){
      const sortF=function(a,b){return a.date<b.date?1:-1;};
      setStrSessions(strL.sort(sortF));
      setCarSessions(carL.sort(sortF));
      clearTimeout(failsafe);
      setReady(true);
    }).catch(function(err){
      console.error('DB Init Error:', err);
      clearTimeout(failsafe);
      setReady(true);
    });
    function handleAutoSync(){
      drainSyncQueue().then(function(synced){
        if(synced>0){
          setSyncMsg(synced+' offline session(s) synced ✓');
          setTimeout(function(){setSyncMsg('');}, 4000);
        }
      }).catch(function(){});
    }
    function onOnline(){handleAutoSync();}
    window.addEventListener('online',onOnline);
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&navigator.onLine)handleAutoSync();});
    return function(){window.removeEventListener('online',onOnline);};
  },[]);

  useEffect(function(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('./sw.js').then(function(reg){
        reg.addEventListener('updatefound', function(){
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', function(){
            if(newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      }).catch(function(){});
    }
  },[]);

  if(!ready){return html`<div class="h-full flex items-center justify-center bg-[var(--bg)] text-[var(--mu)] text-xs tracking-[0.2em]">LOADING...</div>`;}

  const streak=Math.min(99,strSessions.length+carSessions.length);

  return html`<div class="h-full flex flex-col bg-[var(--bg)]">
    <!-- Floating Tactical HUD -->
    <div class="fixed left-4 right-4 flex justify-between items-center z-10 pointer-events-none" style=${{top: `calc(16px + var(--safe-top))`}}>
      <div class="font-mono font-bold text-[#00f0c8] text-sm tracking-wider bg-slate-950/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">WEMYSS<span class="text-fuchsia-500">OS</span></div>
      <div class="flex items-center gap-2 pointer-events-auto bg-slate-950/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800"><span class="animate-pulse">🔥</span><span class="font-bold text-amber-400">${streak}</span></div>
    </div>
    <div class="flex-shrink-0" style=${{height: `calc(60px + var(--safe-top))`}}></div> <!-- Spacer for floating HUD -->
    ${tab==='home'?html`<${HomeScreen} strSessions=${strSessions} carSessions=${carSessions}/>`:null}
    ${tab==='strength'?html`<${StrengthScreen} strSessions=${strSessions} setSessions=${setStrSessions}/>`:null}
    ${tab==='cardio'?html`<${CardioScreen} carSessions=${carSessions} setSessions=${setCarSessions}/>`:null}
    ${tab==='plan'?html`<${PlanScreen} strSessions=${strSessions} carSessions=${carSessions} setStrSessions=${setStrSessions} setCarSessions=${setCarSessions}/>`:null}
    ${tab==='progress'?html`<${ProgressScreen} strSessions=${strSessions} carSessions=${carSessions}/>`:null}
    ${tab==='body'?html`<${BodyScreen}/>`:null}
    ${tab==='sync'?html`<${SyncScreen} strSessions=${strSessions} carSessions=${carSessions}/>`:null}
    <div class="fixed z-50 flex items-center justify-between gap-4 px-4 py-3 text-sm font-bold text-white bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,255,0.2)] rounded-xl left-4 right-4 transition-all duration-500 ease-out ${updateAvailable ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}" style=${{bottom: `calc(80px + var(--safe-bottom))`}}>
      <span class="flex items-center gap-2"><span class="animate-pulse text-cyan-400">✨</span> Update available!</span>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" onclick=${()=>setUpdateAvailable(false)}>Dismiss</button><button class="px-3 py-1.5 text-xs text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors" onclick=${()=>window.location.reload()}>Reload</button>
      </div>
    </div>
    <div class="fixed z-50 flex items-center gap-2 px-4 py-3 text-sm font-bold text-green-50 bg-green-900/95 backdrop-blur-md border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] rounded-xl left-4 right-4 transition-all duration-500 ease-out ${syncMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}" style=${{bottom: updateAvailable ? `calc(140px + var(--safe-bottom))` : `calc(80px + var(--safe-bottom))`}}><span class="animate-bounce">☁️</span> ${syncMsg}</div>
    <${RestTimer}/>
    <${Nav} tab=${tab} setTab=${setTab}/>
  </div>`;
}

render(html`<${App}/>`, document.getElementById('app'));
