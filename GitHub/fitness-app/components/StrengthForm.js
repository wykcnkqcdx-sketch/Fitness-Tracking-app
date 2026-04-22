import { h } from 'https://esm.sh/preact@10.29.0';
import { useState } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { todayISO, fmtLabel, uid, calcTotalVol, EXERCISE_LIB } from './utils.js';

export function StrengthForm(props){
  const init = props.initialData || {};
  const initBlocks = init.blocks || [{name:'',target:'',notes:'',sets:[{weight:'',reps:''},{weight:'',reps:''},{weight:'',reps:''}]}];
  const ds=useState(init.date || todayISO());const date=ds[0];const setDate=ds[1];
  const ws=useState(init.warmup || '');const warmup=ws[0];const setWarmup=ws[1];
  const bs=useState(initBlocks);const blocks=bs[0];const setBlocks=bs[1];
  const sv=useState(false);const saving=sv[0];const setSaving=sv[1];
  const es=useState('');const err=es[0];const setErr=es[1];

  const pmS=useState(false);const showPm=pmS[0];const setShowPm=pmS[1];
  const pmwS=useState('');const pmW=pmwS[0];const setPmW=pmwS[1];
  const pmbS=useState(20);const pmB=pmbS[0];const setPmB=pmbS[1];

  const pmPlates = [];
  let pmRem = 0;
  if(pmW && Number(pmW) > pmB) {
    let targetSide = (Number(pmW) - pmB) / 2;
    const avail = [25, 20, 15, 10, 5, 2.5, 1.25];
    avail.forEach(function(p){
      while(targetSide >= p - 0.01) { // tolerance for floating point math
        pmPlates.push(p);
        targetSide -= p;
      }
    });
    pmRem = targetSide > 0.01 ? targetSide * 2 : 0;
  }

  function addBlock(){setBlocks(function(p){return p.concat([{name:'',target:'',notes:'',sets:[{weight:'',reps:''}]}]);});}
  function removeBlock(bi){if(confirm('Delete this exercise?'))setBlocks(function(p){return p.filter(function(_,i){return i!==bi;});});}
  function addSet(bi){setBlocks(function(p){return p.map(function(b,i){if(i!==bi)return b;const ls=b.sets[b.sets.length-1]||{weight:'',reps:''};return Object.assign({},b,{sets:b.sets.concat([{weight:ls.weight,reps:ls.reps}])});});});}
  function removeSet(bi,si){if(confirm('Delete this set?'))setBlocks(function(p){return p.map(function(b,i){if(i!==bi)return b;return Object.assign({},b,{sets:b.sets.filter(function(_,j){return j!==si;})});});});}
  function updName(bi,v){setBlocks(function(p){return p.map(function(b,i){if(i!==bi)return b;return Object.assign({},b,{name:v});});});}
  function updTarget(bi,v){setBlocks(function(p){return p.map(function(b,i){if(i!==bi)return b;return Object.assign({},b,{target:v});});});}
  function updNotes(bi,v){setBlocks(function(p){return p.map(function(b,i){if(i!==bi)return b;return Object.assign({},b,{notes:v});});});}
  function updSet(bi,si,f,v){setBlocks(function(p){return p.map(function(b,i){if(i!==bi)return b;const ns=b.sets.map(function(s,j){if(j!==si)return s;const n=Object.assign({},s);n[f]=v;return n;});return Object.assign({},b,{sets:ns});});});}
  function moveBlock(bi,dir){if(bi+dir<0||bi+dir>=blocks.length)return;setBlocks(function(p){const n=p.slice();const t=n[bi];n[bi]=n[bi+dir];n[bi+dir]=t;return n;});}
  function moveSet(bi,si,dir){setBlocks(function(p){return p.map(function(b,i){if(i!==bi)return b;if(si+dir<0||si+dir>=b.sets.length)return b;const ns=b.sets.slice();const t=ns[si];ns[si]=ns[si+dir];ns[si+dir]=t;return Object.assign({},b,{sets:ns});});});}

  function save(){
    setErr('');
    if(!date){setErr('Date required');return;}
    const cleaned=blocks.filter(function(b){return b.name.trim();}).map(function(b){
      return{name:b.name.trim(),target:(b.target||'').trim(),notes:(b.notes||'').trim(),sets:b.sets.filter(function(s){return s.reps!=='';}).map(function(s){
        return{weight:s.weight===''?null:parseFloat(s.weight)||null,reps:isNaN(Number(s.reps))?s.reps:Number(s.reps)};
      })};
    }).filter(function(b){return b.sets.length>0;});
    if(!cleaned.length){setErr('Add at least one set');return;}
    const sess={id:init.id || uid(),date:date,label:fmtLabel(date),warmup:warmup.trim(),blocks:cleaned};
    
    if(init.id){
      const oldVol=calcTotalVol(init);
      const newVol=calcTotalVol(sess);
      if(oldVol>0&&newVol<oldVol*0.8){
        if(!confirm('Total volume dropped significantly ('+oldVol.toLocaleString()+'kg → '+newVol.toLocaleString()+'kg). Save changes?'))return;
      }
    }
    
    setSaving(true);
    props.onSave(sess).catch(function(){setErr('Save failed');setSaving(false);});
  }

  return html`<div class="card" style="padding:16px;margin-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span style="font-size:14px;font-weight:700;color:var(--blue)">${init.id?'Edit':'New'} Strength Session</span>
      <div style="display:flex;gap:8px">
        <button class="btn-sm btn-ghost" style="padding:4px 8px;font-size:14px" onclick=${()=>setShowPm(!showPm)}>🧮</button>
        <button class="btn-sm btn-ghost" onclick=${props.onCancel}>Cancel</button>
      </div>
    </div>
    ${showPm?html`
      <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:12px;margin-bottom:12px">
        <div style="font-size:12px;font-weight:700;margin-bottom:10px;color:var(--blue)">Plate Calculator</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div><label class="lbl">Target kg</label><input type="number" class="inp" value=${pmW} oninput=${(e)=>setPmW(e.target.value)} placeholder="100"/></div>
          <div><label class="lbl">Bar kg</label><input type="number" class="inp" value=${pmB} oninput=${(e)=>setPmB(Number(e.target.value))}/></div>
        </div>
        ${pmW?html`
          <div style="padding-top:10px;border-top:1px solid var(--bd)">
            <div style="font-size:11px;color:var(--mu);margin-bottom:6px">Load on EACH side:</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${pmPlates.length?pmPlates.map(function(p){return html`<div style="background:var(--blue);color:#fff;font-weight:800;font-size:12px;padding:4px 8px;border-radius:4px">${p}</div>`;}):html`<div style="font-size:12px;color:var(--mu)">Bar only</div>`}
            </div>
            ${pmRem>0?html`<div style="font-size:10px;color:var(--orange);margin-top:6px">Note: ${pmRem.toFixed(2)}kg short of target.</div>`:null}
          </div>
        `:null}
      </div>
    `:null}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
      <div><label class="lbl">Date</label><input type="date" class="inp" value=${date} onchange=${(e)=>setDate(e.target.value)}/></div>
      <div><label class="lbl">Warm-up</label><input type="text" class="inp" value=${warmup} oninput=${(e)=>setWarmup(e.target.value)} placeholder="Row 5 min"/></div>
    </div>
    ${blocks.map(function(block,bi){return html`
      <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:12px;margin-bottom:10px">
        <div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
          <select class="inp" style="flex:1" value=${block.name} onchange=${(e)=>updName(bi,e.target.value)}>
            <option value="">— Select exercise —</option>
            ${Object.keys(EXERCISE_LIB).map(function(cat){return html`<optgroup label=${cat}>${EXERCISE_LIB[cat].map(function(ex){return html`<option value=${ex}>${ex}</option>`;})}</optgroup>`;})}
            <option value=${block.name&&!Object.values(EXERCISE_LIB).flat().includes(block.name)?block.name:''} selected=${block.name&&!Object.values(EXERCISE_LIB).flat().includes(block.name)}>${block.name&&!Object.values(EXERCISE_LIB).flat().includes(block.name)?block.name:''}</option>
          </select>
          <div style="display:flex;gap:2px">
            <button class="btn-sm btn-ghost" style="padding:4px 8px" onclick=${()=>moveBlock(bi,-1)} disabled=${bi===0}>↑</button>
            <button class="btn-sm btn-ghost" style="padding:4px 8px" onclick=${()=>moveBlock(bi,1)} disabled=${bi===blocks.length-1}>↓</button>
            <button class="btn-sm" style="background:rgba(248,113,113,0.15);color:var(--red);margin-left:4px" onclick=${()=>removeBlock(bi)}>×</button>
          </div>
        </div>
        <input type="text" class="inp" style="margin-bottom:8px" value=${block.name} oninput=${(e)=>updName(bi,e.target.value)} placeholder="Or type custom exercise name"/>
        <input type="text" class="inp" style="margin-bottom:8px;font-size:12px;padding:8px 14px" value=${block.target||''} oninput=${(e)=>updTarget(bi,e.target.value)} placeholder="Target RPE / RIR (optional)"/>
        <input type="text" class="inp" style="margin-bottom:8px;font-size:12px;padding:8px 14px" value=${block.notes||''} oninput=${(e)=>updNotes(bi,e.target.value)} placeholder="Notes (e.g., form cues, feeling)"/>
        ${block.sets.map(function(set,si){return html`
          <div style="display:grid;grid-template-columns:24px 1fr 1fr 50px 28px;gap:6px;margin-bottom:6px;align-items:center">
            <div style="color:var(--mu);font-size:12px;text-align:center">${si+1}</div>
            <input type="number" class="inp" value=${set.weight} oninput=${(e)=>updSet(bi,si,'weight',e.target.value)} placeholder="kg"/>
            <input type="text" class="inp" value=${set.reps} oninput=${(e)=>updSet(bi,si,'reps',e.target.value)} placeholder="reps"/>
            <div style="display:flex;gap:2px">
              <button class="btn-sm btn-ghost" style="padding:4px 6px" onclick=${()=>moveSet(bi,si,-1)} disabled=${si===0}>↑</button>
              <button class="btn-sm btn-ghost" style="padding:4px 6px" onclick=${()=>moveSet(bi,si,1)} disabled=${si===block.sets.length-1}>↓</button>
            </div>
            <button class="btn-sm btn-ghost" onclick=${()=>removeSet(bi,si)}>−</button>
          </div>`;})}
        <button class="btn-sm btn-ghost" style="margin-top:6px" onclick=${()=>addSet(bi)}>+ Set</button>
      </div>`;})}
    <button class="btn btn-outline" style="margin-bottom:12px" onclick=${addBlock}>+ Add Exercise</button>
    ${err?html`<div class="err">${err}</div>`:null}
    <button class="btn btn-primary" onclick=${save} disabled=${saving}>${saving?'Saving...':'Save Session'}</button>
  </div>`;
}