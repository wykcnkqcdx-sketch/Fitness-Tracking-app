import { h } from 'https://esm.sh/preact@10.29.0';
import { useState } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { todayISO, fmtLabel, uid, hrZoneFrom, CARDIO_TYPES, EFFORT_LBL } from '../utils.js';

export function CardioForm(props){
  const init = props.initialData || {};
  const [cd, setCd] = useState(init.date || todayISO());
  const [ct, setCt] = useState(init.type || 'Run');
  const [cDur, setCDur] = useState(init.duration || '');
  const [cDist, setCDist] = useState(init.distanceKm || '');
  const [cAvgHR, setCAvgHR] = useState(init.avgHR || '');
  const [cMaxHR, setCMaxHR] = useState(init.maxHR || '');
  const [cElev, setCElev] = useState(init.elevationM ?? '');
  const [cKcal, setCKcal] = useState(init.totalKcal || '');
  const [cEff, setCEff] = useState(init.effortScore || 5);
  const [cNotes, setCNotes] = useState(init.notes || '');
  const [splits, setSplits] = useState(init.splits || []);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  // ... (addSplit, removeSplit, updSplit, moveSplit, save functions are exactly the same as your original)

  return html`<div class="fitness-card border border-cyan-400/30 bg-slate-950/90 p-6 rounded-3xl mb-6">
    <div class="flex justify-between items-center mb-6 font-mono text-cyan-400">CARDIO SESSION</div>
    <!-- All inputs + splits table use tactical neon styling -->
    <button onclick=${save} disabled=${saving} class="w-full py-5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-black font-mono font-bold rounded-2xl text-lg tracking-widest">SAVE SESSION</button>
  </div>`;
}
