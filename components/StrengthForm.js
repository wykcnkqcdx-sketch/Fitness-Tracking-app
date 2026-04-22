import { h } from 'https://esm.sh/preact@10.29.0';
import { useState } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { todayISO, fmtLabel, uid, calcTotalVol, EXERCISE_LIB } from '../utils.js';

export function StrengthForm(props) {
  const init = props.initialData || {};
  const [date, setDate] = useState(init.date || todayISO());
  const [warmup, setWarmup] = useState(init.warmup || '');
  const [blocks, setBlocks] = useState(init.blocks || [{name:'', sets:[{weight:'',reps:''}]}]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  // Simplified save (add your full logic here if you want)
  const save = () => {
    setSaving(true);
    const sess = { id: init.id || uid(), date, warmup, blocks, label: fmtLabel(date) };
    props.onSave(sess).then(() => setSaving(false)).catch(() => { setErr('Save failed'); setSaving(false); });
  };

  return html`
    <div class="p-6 bg-slate-950 border border-cyan-400/30 rounded-3xl mb-6">
      <div class="font-mono text-cyan-400 text-lg mb-6">STRENGTH SESSION</div>
      <input type="date" value=${date} onchange=${e => setDate(e.target.value)} class="w-full p-3 bg-slate-900 border border-cyan-400 rounded-2xl mb-4" />
      <button onclick=${save} disabled=${saving} class="w-full py-5 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-black font-bold rounded-2xl">
        ${saving ? 'SAVING...' : 'SAVE SESSION'}
      </button>
      ${err ? html`<div class="text-red-400 text-sm mt-3">${err}</div>` : null}
    </div>`;
}
