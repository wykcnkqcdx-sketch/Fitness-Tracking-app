import { h } from 'https://esm.sh/preact@10.29.0';
import { useState, useEffect } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { currentPlanWeek, PLAN, calcTotalVol, hrCol } from '../utils.js';
import { dbGetAll, drainSyncQueue, getSyncConfig } from '../store.js';
import { BodyMap } from './BodyMap.js';

export function HomeScreen(props) {
  const str = props.strSessions, car = props.carSessions;
  const planWk = currentPlanWeek(str);
  const planRow = PLAN[planWk - 1] || PLAN[0];
  const dow = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
  const todayPrescription = planRow[dow] || 'Rest';
  const lastStr = str.length ? str[0] : null;
  const lastCar = car.length ? car[0] : null;
  const weekVol = str.filter(s => {
    const d = new Date(s.date + 'T12:00:00');
    return (Date.now() - d) < 7 * 86400000;
  }).reduce((a, s) => a + calcTotalVol(s), 0);
  const weekKm = car.filter(s => {
    const d = new Date(s.date + 'T12:00:00');
    return (Date.now() - d) < 7 * 86400000;
  }).reduce((a, s) => a + s.distanceKm, 0);

  const bodyState = useState(new Set());
  const selBody = bodyState[0];
  const setSelBody = bodyState[1];
  const toggleBody = (part) => {
    setSelBody(p => {
      const n = new Set(p);
      n.has(part) ? n.delete(part) : n.add(part);
      return n;
    });
  };

  const qCount = useState(0);
  const queueN = qCount[0];
  const setQueueN = qCount[1];
  useEffect(() => { dbGetAll('syncQueue').then(q => setQueueN(q.length)); }, []);

  const syncCfg = getSyncConfig();

  // Body rec
  const bodyRec = () => {
    if (selBody.size === 0) return 'TAP ZONES FOR TODAY\'S TARGETS';
    const recs = [];
    if (selBody.has('chest') || selBody.has('arms')) recs.push('BENCH PRESS');
    if (selBody.has('shoulders')) recs.push('MILITARY PRESS');
    if (selBody.has('back')) recs.push('ROW / DEADLIFT');
    if (selBody.has('core')) recs.push('PLANK');
    if (selBody.has('glutes') || selBody.has('quads')) recs.push('BULGARIAN SQUAT');
    return recs.join(' • ') || 'NO TARGETS';
  };

  return html`<div class="screen">
    <div class="screen-inner">
      <!-- Tactical Hero -->
      <div class="fitness-card p-6 border border-cyan-400/30 bg-slate-950/70 backdrop-blur-xl rounded-3xl mb-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-mono text-xs tracking-[2px] text-cyan-400">WEEK ${planWk} • ${planRow.phase}</div>
            <div class="text-4xl font-bold text-white mt-1">${todayPrescription}</div>
          </div>
          <div class="text-5xl">🔥</div>
        </div>
        <div class="h-2 bg-slate-900 rounded-full mt-8 overflow-hidden">
          <div class="h-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400" style="width:${(planWk/12)*100}%"></div>
        </div>
      </div>

      ${queueN > 0 && syncCfg.url ? html`
        <div class="bg-orange-950/80 border border-orange-400/50 rounded-2xl p-4 mb-6 flex justify-between items-center">
          <span class="font-mono text-orange-400">☁ ${queueN} PENDING SYNC</span>
          <button onclick=${() => { drainSyncQueue().then(() => dbGetAll('syncQueue').then(q => setQueueN(q.length))); }} class="px-4 py-1 bg-orange-400 text-black font-mono text-xs rounded-xl">SYNC NOW</button>
        </div>` : null}

      <div class="grid grid-cols-3 gap-3 mb-8">
        <div class="bg-slate-900/80 border border-cyan-400/30 rounded-3xl p-4 text-center">
          <div class="text-3xl font-bold text-cyan-400">${weekVol || 0}</div>
          <div class="text-xs font-mono tracking-widest text-slate-400">KG WEEK</div>
        </div>
        <div class="bg-slate-900/80 border border-emerald-400/30 rounded-3xl p-4 text-center">
          <div class="text-3xl font-bold text-emerald-400">${weekKm.toFixed(1)}</div>
          <div class="text-xs font-mono tracking-widest text-slate-400">KM WEEK</div>
        </div>
        <div class="bg-slate-900/80 border border-amber-400/30 rounded-3xl p-4 text-center">
          <div class="text-3xl font-bold text-amber-400">${str.length + car.length}</div>
          <div class="text-xs font-mono tracking-widest text-slate-400">SESSIONS</div>
        </div>
      </div>

      <span class="block text-xs font-mono tracking-[1px] text-cyan-400 mb-3">FOCUS ZONES</span>
      <div class="body-map bg-slate-900/80 border border-cyan-400/30 rounded-3xl p-6 mb-8">
        <${BodyMap} selected=${selBody} onSelect=${toggleBody} />
        <div class="text-center text-xs font-mono text-cyan-300 mt-4">${bodyRec()}</div>
      </div>

      ${lastStr ? html`<div class="fitness-card p-5 rounded-3xl mb-6">
        <div class="flex justify-between text-xs font-mono"><span class="text-cyan-400">LAST STRENGTH</span><span>${lastStr.label}</span></div>
        <div class="mt-4 flex justify-between items-center">
          <div>
            <div class="font-semibold">${lastStr.blocks.length} EXERCISES</div>
            <div class="text-xs text-slate-400">${lastStr.blocks.reduce((a,b)=>a+b.sets.length,0)} SETS</div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-cyan-400">${calcTotalVol(lastStr)}</div>
            <div class="text-xs font-mono text-slate-400">KG VOL</div>
          </div>
        </div>
      </div>` : null}

      ${lastCar ? html`<div class="fitness-card p-5 rounded-3xl">
        <div class="flex justify-between text-xs font-mono"><span class="text-emerald-400">LAST CARDIO</span><span>${lastCar.label}</span></div>
        <div class="mt-4 flex justify-between">
          <div>
            <span class="inline-block px-3 py-1 bg-emerald-400/10 text-emerald-400 text-xs font-mono rounded-2xl">Z${lastCar.hrZone}</span>
            <span class="ml-3 text-emerald-400">${lastCar.type}</span>
          </div>
          <div class="text-right">
            <div class="text-xl font-bold">${lastCar.duration}</div>
            <div class="text-xs text-slate-400">${lastCar.avgHR} BPM • ${lastCar.distanceKm} KM</div>
          </div>
        </div>
      </div>` : null}
    </div>
  </div>`;
}
