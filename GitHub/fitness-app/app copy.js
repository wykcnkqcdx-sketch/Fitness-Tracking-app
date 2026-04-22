import { h, render } from 'https://esm.sh/preact@10.29.0';
import { useState, useEffect } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { dbGetAll, dbPut, drainSyncQueue } from './store.js';
import { SEED_STR, SEED_CAR } from './utils.js';
import { HomeScreen, StrengthScreen, CardioScreen, PlanScreen, ProgressScreen, BodyScreen, SyncScreen, Nav, RestTimer } from './components.js';

function App(){
  var tabS=useState('home');var tab=tabS[0];var setTab=tabS[1];
  var strS=useState([]);var strSessions=strS[0];var setStrSessions=strS[1];
  var carS=useState([]);var carSessions=carS[0];var setCarSessions=carS[1];
  var readyS=useState(false);var ready=readyS[0];var setReady=readyS[1];
  var uaS=useState(false);var updateAvailable=uaS[0];var setUpdateAvailable=uaS[1];
  var syncMsgS=useState('');var syncMsg=syncMsgS[0];var setSyncMsg=syncMsgS[1];
  var themeS=useState(function(){
    try {
      var stored=localStorage.getItem('ww_theme');
      if(stored)return stored;
    } catch(e) {}
    return window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  });
  var theme=themeS[0];var setTheme=themeS[1];

  useEffect(function(){
    document.documentElement.setAttribute('data-theme',theme);
    try { localStorage.setItem('ww_theme',theme); } catch(e) {}
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content',theme==='light'?'#f8fafc':'#0a0f1c');
  },[theme]);

  useEffect(function(){
    if(navigator&&navigator.storage&&navigator.storage.persist){navigator.storage.persist().catch(function(){});}
    var strL=[],carL=[];
    var p1=dbGetAll('strength').then(function(d){strL=d;}).catch(function(){strL=[];});
    var p2=dbGetAll('cardio').then(function(d){carL=d;}).catch(function(){carL=[];});
    Promise.all([p1,p2]).then(function(){
      if(!strL.length){strL=SEED_STR.slice();return Promise.all(SEED_STR.map(function(s){return dbPut('strength',s);})).catch(function(){});}
    }).then(function(){
      if(!carL.length){carL=SEED_CAR.slice();return Promise.all(SEED_CAR.map(function(s){return dbPut('cardio',s);})).catch(function(){});}
    }).then(function(){
      var sortF=function(a,b){return a.date<b.date?1:-1;};
      setStrSessions(strL.sort(sortF));
      setCarSessions(carL.sort(sortF));
      setReady(true);
    }).catch(function(err){
      console.error('DB Init Error:', err);
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
          var newWorker = reg.installing;
          newWorker.addEventListener('statechange', function(){
            if(newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      }).catch(function(){});
    }
  },[]);

  if(!ready){return html`<div style="display:flex;height:100vh;align-items:center;justify-content:center;background:var(--bg);color:var(--mu);font-size:12px;letter-spacing:0.2em">LOADING...</div>`;}

  var streak=Math.min(99,strSessions.length+carSessions.length);

  return html`<div style="height:100%;display:flex;flex-direction:column;background:var(--bg)">
    <div class="hdr">
      <div class="hdr-left"><div class="hdr-logo">🏋️</div><div><div class="hdr-title">WEMYSSWORKOUTS</div><div class="hdr-sub">SGT WEMYSS</div></div></div>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="hdr-streak"><span class="flame">🔥</span><span class="hdr-streak-num">${streak}</span></div>
        <button onclick=${()=>setTheme(theme==='light'?'dark':'light')} style="background:var(--bg2);border:1px solid var(--bd);border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;color:var(--tx);padding:0" aria-label="Toggle theme">${theme==='light'?'🌙':'☀️'}</button>
      </div>
    </div>
    ${tab==='home'?html`<${HomeScreen} strSessions=${strSessions} carSessions=${carSessions}/>`:null}
    ${tab==='strength'?html`<${StrengthScreen} strSessions=${strSessions} setSessions=${setStrSessions}/>`:null}
    ${tab==='cardio'?html`<${CardioScreen} carSessions=${carSessions} setSessions=${setCarSessions}/>`:null}
    ${tab==='plan'?html`<${PlanScreen} strSessions=${strSessions} carSessions=${carSessions} setStrSessions=${setStrSessions} setCarSessions=${setCarSessions}/>`:null}
    ${tab==='progress'?html`<${ProgressScreen} strSessions=${strSessions} carSessions=${carSessions}/>`:null}
    ${tab==='body'?html`<${BodyScreen}/>`:null}
    ${tab==='sync'?html`<${SyncScreen} strSessions=${strSessions} carSessions=${carSessions}/>`:null}
    ${updateAvailable?html`<div class="toast"><span style="font-size:13px;font-weight:700">Update available!</span><div style="display:flex;gap:8px"><button class="btn-sm" style="background:rgba(255,255,255,0.2);color:#fff" onclick=${()=>setUpdateAvailable(false)}>Dismiss</button><button class="btn-sm" style="background:#fff;color:var(--blue)" onclick=${()=>window.location.reload()}>Reload</button></div></div>`:null}
    ${syncMsg?html`<div class="toast" style="bottom:${updateAvailable?'calc(140px + var(--safe-bottom))':'calc(80px + var(--safe-bottom))'};background:linear-gradient(135deg,var(--green),#22c55e);box-shadow:0 8px 24px rgba(74,222,128,0.4)"><span style="font-size:13px;font-weight:700;color:#000">☁️ ${syncMsg}</span></div>`:null}
    <${RestTimer}/>
    <${Nav} tab=${tab} setTab=${setTab}/>
  </div>`;
}

render(html`<${App}/>`, document.getElementById('app'));
