// ================================================
// WEMYSSWORKOUTS - Tactical Neon App
// Corrected imports for components/ folder
// ================================================

window.addEventListener('error', function(e) {
  console.error('App Error:', e.message);
});

import { h, render } from 'https://esm.sh/preact@10.29.0';
import { useState, useEffect } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';

import { dbGetAll, dbPut, drainSyncQueue } from './store.js';
import { SEED_STR, SEED_CAR } from './utils.js';

// Import from components/ folder
import { HomeScreen } from './components/HomeScreen.js';
import { StrengthScreen } from './components/StrengthScreen.js';
import { CardioScreen } from './components/CardioScreen.js';
import { PlanScreen } from './components/PlanScreen.js';
import { ProgressScreen } from './components/ProgressScreen.js';
import { BodyScreen } from './components/BodyScreen.js';
import { SyncScreen } from './components/SyncScreen.js';
import { Nav } from './components/Nav.js';
import { RestTimer } from './components/RestTimer.js';

function App() {
  const [tab, setTab] = useState('home');
  const [strSessions, setStrSessions] = useState([]);
  const [carSessions, setCarSessions] = useState([]);
  const [ready, setReady] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  // Initialize data + auto sync
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }

    let strL = [], carL = [];
    const p1 = dbGetAll('strength').then(d => strL = d).catch(() => strL = []);
    const p2 = dbGetAll('cardio').then(d => carL = d).catch(() => carL = []);

    Promise.all([p1, p2]).then(() => {
      if (!strL.length) {
        strL = SEED_STR.slice();
        return Promise.all(SEED_STR.map(s => dbPut('strength', s)));
      }
    }).then(() => {
      if (!carL.length) {
        carL = SEED_CAR.slice();
        return Promise.all(SEED_CAR.map(s => dbPut('cardio', s)));
      }
    }).then(() => {
      const sortF = (a, b) => a.date < b.date ? 1 : -1;
      setStrSessions(strL.sort(sortF));
      setCarSessions(carL.sort(sortF));
      setReady(true);
    }).catch(err => {
      console.error('DB Init Error:', err);
      setReady(true);
    });

    // Auto sync when online
    const handleAutoSync = () => {
      drainSyncQueue().then(synced => {
        if (synced > 0) {
          setSyncMsg(synced + ' offline session(s) synced ✓');
          setTimeout(() => setSyncMsg(''), 4000);
        }
      });
    };

    window.addEventListener('online', handleAutoSync);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) handleAutoSync();
    });

    return () => window.removeEventListener('online', handleAutoSync);
  }, []);

  // Service Worker update detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      });
    }
  }, []);

  if (!ready) {
    return html`<div class="h-full flex items-center justify-center bg-[#03070b] text-[#00f3ff] font-mono text-xs tracking-[3px]">INITIALIZING TACTICAL CORE...</div>`;
  }

  const streak = Math.min(99, strSessions.length + carSessions.length);

  return html`<div class="h-full flex flex-col bg-[#03070b] text-white">
    <!-- Tactical HUD -->
    <div class="fixed left-4 right-4 top-[16px] z-50 flex justify-between items-center pointer-events-none">
      <div class="font-mono font-bold text-[#00f3ff] tracking-widest bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-400/30">WEMYSS<span class="text-fuchsia-400">OS</span></div>
      <div class="flex items-center gap-3 pointer-events-auto bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/30">
        <span class="animate-pulse">🔥</span>
        <span class="font-bold text-amber-400">${streak}</span>
      </div>
    </div>

    <div style="height: calc(68px + var(--safe-top, 0px));"></div>

    ${tab === 'home' ? html`<${HomeScreen} strSessions=${strSessions} carSessions=${carSessions}/>` : null}
    ${tab === 'strength' ? html`<${StrengthScreen} strSessions=${strSessions} setSessions=${setStrSessions}/>` : null}
    ${tab === 'cardio' ? html`<${CardioScreen} carSessions=${carSessions} setSessions=${setCarSessions}/>` : null}
    ${tab === 'plan' ? html`<${PlanScreen} strSessions=${strSessions} carSessions=${carSessions} setStrSessions=${setStrSessions} setCarSessions=${setCarSessions}/>` : null}
    ${tab === 'progress' ? html`<${ProgressScreen} strSessions=${strSessions} carSessions=${carSessions}/>` : null}
    ${tab === 'body' ? html`<${BodyScreen}/>` : null}
    ${tab === 'sync' ? html`<${SyncScreen} strSessions=${strSessions} carSessions=${carSessions}/>` : null}

    ${updateAvailable ? html`
      <div class="fixed bottom-[100px] left-4 right-4 bg-slate-900 border border-cyan-400 text-cyan-400 p-4 rounded-2xl flex justify-between items-center z-50">
        UPDATE AVAILABLE
        <button onclick=${() => window.location.reload()} class="bg-cyan-400 text-black px-5 py-2 rounded-xl font-mono text-sm">RELOAD</button>
      </div>` : null}

    ${syncMsg ? html`
      <div class="fixed bottom-[160px] left-4 right-4 bg-emerald-900 border border-emerald-400 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 z-50">
        ☁️ ${syncMsg}
      </div>` : null}

    <${RestTimer}/>
    <${Nav} tab=${tab} setTab=${setTab}/>
  </div>`;
}

render(html`<${App}/>`, document.getElementById('app'));
