import { h } from 'https://esm.sh/preact@10.29.0';
import { useState } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { todayISO, fmtLabel, uid, hrZoneFrom, CARDIO_TYPES, EFFORT_LBL } from './utils.js';

export function CardioForm(props){
  const init = props.initialData || {};
  const ds=useState(init.date || todayISO());const cd=ds[0];const setCd=ds[1];
  const ts=useState(init.type || 'Run');const ct=ts[0];const setCt=ts[1];
  const durs=useState(init.duration || '');const cDur=durs[0];const setCDur=durs[1];
  const dists=useState(init.distanceKm || '');const cDist=dists[0];const setCDist=dists[1];
  const ahrs=useState(init.avgHR || '');const cAvgHR=ahrs[0];const setCAvgHR=ahrs[1];
  const mhrs=useState(init.maxHR || '');const cMaxHR=mhrs[0];const setCMaxHR=mhrs[1];
  const elevs=useState(init.elevationM ?? '');const cElev=elevs[0];const setCElev=elevs[1];
  const kcals=useState(init.totalKcal || '');const cKcal=kcals[0];const setCKcal=kcals[1];
  const effs=useState(init.effortScore || 5);const cEff=effs[0];const setCEff=effs[1];
  const notesS=useState(init.notes || '');const cNotes=notesS[0];const setCNotes=notesS[1];
  const spS=useState(init.splits || []);const splits=spS[0];const setSplits=spS[1];
  const sv=useState(false);const saving=sv[0];const setSaving=sv[1];
  const es=useState('');const err=es[0];const setErr=es[1];

  function addSplit(){setSplits(p => p.concat([{km:p.length+1,time:'',pace:'',hr:''}]));}
  function removeSplit(idx){if(confirm('Delete this split?'))setSplits(p => p.filter((_,i) => i!==idx).map((s,i) => ({...s, km: i+1}) ));}
  function updSplit(idx,f,v){setSplits(p => p.map((s,i) => i!==idx ? s : {...s, [f]:v} ));}
  function moveSplit(idx,dir){if(idx+dir<0||idx+dir>=splits.length)return;setSplits(p => {const n=p.slice();const t=n[idx];n[idx]=n[idx+dir];n[idx+dir]=t;return n.map((s,i) => ({...s, km: i + 1}));});}

  function save(){
    setErr('');
    if(!cd){setErr('Date required');return;}
    if(!cDur){setErr('Duration required');return;}
    const distNum=parseFloat(cDist)||0,hrNum=parseInt(cAvgHR)||0;
    setSaving(true);
    const cleanedSplits=splits.filter(function(s){return s.time||s.pace||s.hr;}).map(function(s,i){
      return {km:i+1,time:s.time||'-',pace:s.pace||'-',hr:parseInt(s.hr)||0};
    });
    const sess={id:init.id || uid(),date:cd,label:fmtLabel(cd),type:ct,duration:cDur,distanceKm:distNum,elevationM:parseInt(cElev)||0,avgPace:'-',avgHR:hrNum,maxHR:parseInt(cMaxHR)||0,activeKcal:parseInt(cKcal)||0,totalKcal:parseInt(cKcal)||0,effortScore:cEff,effortLabel:EFFORT_LBL[cEff]||'Moderate',hrZone:hrZoneFrom(hrNum),notes:cNotes.trim(),splits:cleanedSplits};
    props.onSave(sess).catch(function(){setErr('Save failed');setSaving(false);});
  }

  return html`<div class="card" style="padding:16px;margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span style="font-size:14px;font-weight:700;color:var(--blue)">${init.id?'Edit':'New'} Cardio Session</span>
      <button class="btn-sm btn-ghost" onclick=${props.onCancel}>Cancel</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div><label class="lbl">Date</label><input type="date" class="inp" value=${cd} onchange=${(e)=>setCd(e.target.value)}/></div>
      <div><label class="lbl">Type</label><select class="inp" value=${ct} onchange=${(e)=>setCt(e.target.value)}>${CARDIO_TYPES.map(function(t){return html`<option value=${t}>${t}</option>`;})}</select></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">
      <div><label class="lbl">Time</label><input type="text" class="inp" value=${cDur} oninput=${(e)=>setCDur(e.target.value)} placeholder="45:31"/></div>
      <div><label class="lbl">km</label><input type="number" class="inp" value=${cDist} oninput=${(e)=>setCDist(e.target.value)} placeholder="7.21"/></div>
      <div><label class="lbl">Elev m</label><input type="number" class="inp" value=${cElev} oninput=${(e)=>setCElev(e.target.value)} placeholder="62"/></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
      <div><label class="lbl">Avg HR</label><input type="number" class="inp" value=${cAvgHR} oninput=${(e)=>setCAvgHR(e.target.value)} placeholder="145"/></div>
      <div><label class="lbl">Max HR</label><input type="number" class="inp" value=${cMaxHR} oninput=${(e)=>setCMaxHR(e.target.value)} placeholder="162"/></div>
      <div><label class="lbl">kcal</label><input type="number" class="inp" value=${cKcal} oninput=${(e)=>setCKcal(e.target.value)} placeholder="612"/></div>
    </div>
    <div style="margin-bottom:14px">
      <label class="lbl">Effort ${cEff}/10 — ${EFFORT_LBL[cEff]}</label>
      <input type="range" min="1" max="10" value=${cEff} onchange=${(e)=>setCEff(Number(e.target.value))}/>
    </div>
    <div style="margin-bottom:14px">
      <label class="lbl">Notes (optional)</label>
      <input type="text" class="inp" value=${cNotes} oninput=${(e)=>setCNotes(e.target.value)} placeholder="How did it feel?"/>
    </div>
    
    <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:12px;margin-bottom:14px">
      <label class="lbl">Splits</label>
      ${splits.map(function(sp,i){return html`<div style="display:grid;grid-template-columns:24px 1fr 1fr 1fr 50px 28px;gap:6px;align-items:center;margin-bottom:6px">
        <div style="font-size:12px;color:var(--mu);text-align:center">${sp.km}</div>
        <input type="text" class="inp" value=${sp.time} oninput=${(e)=>updSplit(i,'time',e.target.value)} placeholder="Time"/>
        <input type="text" class="inp" value=${sp.pace} oninput=${(e)=>updSplit(i,'pace',e.target.value)} placeholder="Pace"/>
        <input type="number" class="inp" value=${sp.hr} oninput=${(e)=>updSplit(i,'hr',e.target.value)} placeholder="HR"/>
        <div style="display:flex;gap:2px">
          <button class="btn-sm btn-ghost" style="padding:4px 6px" onclick=${()=>moveSplit(i,-1)} disabled=${i===0}>↑</button>
          <button class="btn-sm btn-ghost" style="padding:4px 6px" onclick=${()=>moveSplit(i,1)} disabled=${i===splits.length-1}>↓</button>
        </div>
        <button class="btn-sm btn-ghost" style="color:var(--red);padding:4px" onclick=${()=>removeSplit(i)}>×</button>
      </div>`;})}
      <button class="btn-sm btn-ghost" style="margin-top:6px" onclick=${addSplit}>+ Add Split</button>
    </div>
    
    ${err?html`<div class="err">${err}</div>`:null}
    <button class="btn btn-primary" onclick=${save} disabled=${saving}>${saving?'Saving...':'Save Session'}</button>
  </div>`;
}