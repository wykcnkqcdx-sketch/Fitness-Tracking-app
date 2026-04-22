import { h } from 'https://esm.sh/preact@10.29.0';
import { useState, useEffect } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { currentPlanWeek, PLAN, calcTotalVol, hrCol } from './utils.js';
import { dbGetAll, drainSyncQueue, getSyncConfig } from './store.js';
import { BodyMap } from './BodyMap.js';

export function HomeScreen(props){
  const str=props.strSessions,car=props.carSessions;
  const planWk=currentPlanWeek(str);
  const planRow=PLAN[planWk-1]||PLAN[0];
  const dow=['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
  const todayPrescription=planRow[dow]||'Rest';
  const lastStr=str.length?str[0]:null;
  const lastCar=car.length?car[0]:null;
  const weekVol=str.filter(function(s){const d=new Date(s.date+'T12:00:00'),now=new Date();return (now-d)<7*24*60*60*1000;}).reduce(function(a,s){return a+calcTotalVol(s);},0);
  const weekKm=car.filter(function(s){const d=new Date(s.date+'T12:00:00'),now=new Date();return(now-d)<7*24*60*60*1000;}).reduce(function(a,s){return a+s.distanceKm;},0);
  const bodyState=useState(new Set());const selBody=bodyState[0];const setSelBody=bodyState[1];
  function toggleBody(part){setSelBody(function(p){var n=new Set(p);if(n.has(part))n.delete(part);else n.add(part);return n;});}
  const qCount=useState(0);const queueN=qCount[0];const setQueueN=qCount[1];
  useEffect(function(){dbGetAll('syncQueue').then(function(q){setQueueN(q.length);});},[]);
  const syncCfg=getSyncConfig();

  let initMac={"cals":2500,"pro":180,"carbs":250,"fat":75};
  try { initMac=JSON.parse(localStorage.getItem('ww_macros')||'{"cals":2500,"pro":180,"carbs":250,"fat":75}'); } catch(e) {}
  const macEditS=useState(false);const macEdit=macEditS[0];const setMacEdit=macEditS[1];
  const macS=useState(initMac);const mac=macS[0];const setMac=macS[1];
  function saveMacros(){
    try { localStorage.setItem('ww_macros', JSON.stringify(mac)); } catch(e) {}
    setMacEdit(false);
  }

  function bodyRec(){
    if(selBody.size===0)return 'Tap body parts for today\'s targeted exercises';
    const recs=[];
    if(selBody.has('chest')||selBody.has('arms'))recs.push('Bench Press');
    if(selBody.has('shoulders'))recs.push('Military Press');
    if(selBody.has('back'))recs.push('Bent Over Row, Deadlift');
    if(selBody.has('core'))recs.push('Plank, Hanging Leg Raise');
    if(selBody.has('glutes')||selBody.has('quads'))recs.push('Bulgarian Split Squat');
    if(selBody.has('calves'))recs.push('Calf Raises');
    return recs.length?recs.join(' · '):'No specific exercises for this area today';
  }

  return html`<div class="screen"><div class="screen-inner">
    <div class="card-hero">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div>
          <div style="font-size:10px;color:var(--blue);text-transform:uppercase;letter-spacing:0.15em;font-weight:700;margin-bottom:4px">WEEK ${planWk} OF 12 · ${planRow.phase}</div>
          <div style="font-size:22px;font-weight:800;letter-spacing:-0.02em">${todayPrescription}</div>
          <div style="font-size:12px;color:var(--mu2);margin-top:2px">${planRow.note}</div>
        </div>
        <div style="font-size:28px">🔥</div>
      </div>
      <div class="pbar-bg" style="margin-top:12px"><div class="pbar" style="width:${(planWk/12)*100}%;background:linear-gradient(90deg,var(--blue),#00e0ff)"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--mu);margin-top:6px"><span>Start</span><span>${planWk}/12 weeks</span><span>Test</span></div>
    </div>

    ${queueN>0&&syncCfg.url?html`
      <div style="background:rgba(251,146,60,0.12);border:1px solid rgba(251,146,60,0.3);border-radius:12px;padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;color:var(--orange);font-weight:600">☁ ${queueN} session${queueN>1?'s':''} waiting to sync</span>
        <button class="btn-sm" style="background:var(--orange);color:#000" onclick=${()=>{drainSyncQueue().then(function(){dbGetAll('syncQueue').then(function(q){setQueueN(q.length);});});}}>Sync</button>
      </div>`:null}

    <div class="stat-grid">
      <div class="stat"><div class="stat-val" style="color:var(--blue)">${weekVol?weekVol.toLocaleString():'0'}</div><div class="stat-lbl">kg · week</div></div>
      <div class="stat"><div class="stat-val" style="color:var(--green)">${weekKm.toFixed(1)}</div><div class="stat-lbl">km · week</div></div>
      <div class="stat"><div class="stat-val" style="color:var(--gold)">${str.length+car.length}</div><div class="stat-lbl">sessions</div></div>
    </div>

    <div class="card" style="padding:16px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-size:13px;font-weight:700">Daily Nutrition Targets</span>
        <button class="btn-sm btn-ghost" onclick=${()=>macEdit?saveMacros():setMacEdit(true)}>${macEdit?'Save':'Edit'}</button>
      </div>
      ${macEdit?html`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div><label class="lbl">Kcal</label><input type="number" class="inp" value=${mac.cals} oninput=${(e)=>setMac(Object.assign({},mac,{cals:e.target.value}))}/></div>
        <div><label class="lbl">Protein (g)</label><input type="number" class="inp" value=${mac.pro} oninput=${(e)=>setMac(Object.assign({},mac,{pro:e.target.value}))}/></div>
        <div><label class="lbl">Carbs (g)</label><input type="number" class="inp" value=${mac.carbs} oninput=${(e)=>setMac(Object.assign({},mac,{carbs:e.target.value}))}/></div>
        <div><label class="lbl">Fat (g)</label><input type="number" class="inp" value=${mac.fat} oninput=${(e)=>setMac(Object.assign({},mac,{fat:e.target.value}))}/></div>
      </div>`:html`<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;text-align:center">
        <div><div style="font-size:18px;font-weight:800;color:var(--blue)">${mac.cals}</div><div style="font-size:10px;color:var(--mu);text-transform:uppercase;margin-top:4px">Kcal</div></div>
        <div><div style="font-size:18px;font-weight:800;color:var(--green)">${mac.pro}</div><div style="font-size:10px;color:var(--mu);text-transform:uppercase;margin-top:4px">Pro</div></div>
        <div><div style="font-size:18px;font-weight:800;color:var(--gold)">${mac.carbs}</div><div style="font-size:10px;color:var(--mu);text-transform:uppercase;margin-top:4px">Carb</div></div>
        <div><div style="font-size:18px;font-weight:800;color:var(--orange)">${mac.fat}</div><div style="font-size:10px;color:var(--mu);text-transform:uppercase;margin-top:4px">Fat</div></div>
      </div>`}
    </div>

    <span class="section-lbl">Focus Areas</span>
    <div class="body-map">
      <${BodyMap} selected=${selBody} onSelect=${toggleBody}/>
      <div style="text-align:center;font-size:12px;color:var(--mu2);margin-top:8px;min-height:32px;padding:0 10px">${bodyRec()}</div>
    </div>

    ${lastStr?html`<div class="card">
      <div class="card-hdr"><span class="card-title">Last Strength</span><span style="font-size:11px;color:var(--mu)">${lastStr.label}</span></div>
      <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:13px;color:var(--tx);font-weight:600">${lastStr.blocks.length} exercises</div>
          <div style="font-size:11px;color:var(--mu)">${lastStr.blocks.reduce(function(a,b){return a+b.sets.length;},0)} sets</div>
        </div>
        <div style="font-size:20px;font-weight:800;color:var(--blue)">${calcTotalVol(lastStr).toLocaleString()} <span style="font-size:11px;color:var(--mu)">kg</span></div>
      </div>
    </div>`:null}

    ${lastCar?html`<div class="card">
      <div class="card-hdr"><span class="card-title">Last Cardio</span><span style="font-size:11px;color:var(--mu)">${lastCar.label}</span></div>
      <div style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <span class="pill" style="background:${hrCol(lastCar.avgHR)}22;color:${hrCol(lastCar.avgHR)};border:1px solid ${hrCol(lastCar.avgHR)}66">Z${lastCar.hrZone}</span>
          <span style="font-size:12px;color:var(--mu2)">${lastCar.type}</span>
        </div>
        <div style="text-align:right">
          <div style="font-size:15px;font-weight:700;color:var(--blue)">${lastCar.duration}</div>
          <div style="font-size:11px;color:var(--mu)">${lastCar.avgHR} bpm · ${lastCar.distanceKm}km</div>
        </div>
      </div>
    </div>`:null}

    <span class="section-lbl" style="margin-top:16px">This Week</span>
    <div class="card">
      ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(function(day,i){
        const keys=['mon','tue','wed','thu','fri','sat','sun'];
        const pres=planRow[keys[i]]||'Rest';
        const isToday=i===((new Date().getDay()+6)%7);
        return html`<div style="padding:11px 16px;border-bottom:1px solid var(--bd);display:flex;justify-content:space-between;align-items:center;background:${isToday?'rgba(0,180,255,0.06)':'transparent'}">
          <span style="font-size:12px;color:${isToday?'var(--blue)':'var(--mu)'};font-weight:${isToday?'700':'500'};width:40px">${day}${isToday?' •':''}</span>
          <span style="font-size:12px;color:${pres==='Rest'?'var(--mu)':'var(--tx)'};font-weight:500">${pres}</span>
        </div>`;
      })}
    </div>
  </div></div>`;
}