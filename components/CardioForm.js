import { h } from 'https://esm.sh/preact@10.29.0';
import { useState } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { todayISO, fmtLabel, uid, hrZoneFrom, CARDIO_TYPES, EFFORT_LBL } from '../utils.js';

export function CardioForm(props) {
  const init = props.initialData || {};
  const [cd, setCd] = useState(init.date || todayISO());
  const [ct, setCt] = useState(init.type || 'Run');
  const [cDur, setCDur] = useState(init.duration || '');
  const [cDist, setCDist] = useState(init.distanceKm || '');
  const [cAvgHR, setCAvgHR] = useState(init.avgHR || '');
  const [cEff, setCEff] = useState(init.effortScore || 5);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const save = () => {
    setSaving(true);
    const sess = {
      id: init.id || uid(),
      date: cd,
      type: ct,
      duration: cDur,
      distanceKm: parseFloat(cDist) || 0,
      avgHR: parseInt(cAvgHR) || 0,
      effortScore: cEff,
      label: fmtLabel(cd)
    };
    props.onSave(sess).then(() => setSaving(false)).catch(() => { setErr('Save failed'); setSaving(false); });
  };

  return html`
    <div class="p-6 bg-slate-950 border border-cyan-400/30 rounded-3xl mb-6">
      <div class="font-mono text-cyan-400 text-lg mb-6">CARDIO SESSION</div>
      <input type="date" value=${cd} onchange=${e => setCd(e.target.value)} class="w-full p-3 bg-slate-900 border border-cyan-400 rounded-2xl mb-4" />
      <select value=${ct} onchange=${e => setCt(e.target.value)} class="w-full p-3 bg-slate-900 border border-cyan-400 rounded-2xl mb-4">
        ${CARDIO_TYPES.map(t => html`<option value=${t}>${t}</option>`)}
      </select>
      <button onclick=${save} disabled=${saving} class="w-full py-5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-black font-bold rounded-2xl">
        ${saving ? 'SAVING...' : 'SAVE CARDIO SESSION'}
      </button>
      ${err ? html`<div class="text-red-400 text-sm mt-3">${err}</div>` : null}
    </div>`;
}
