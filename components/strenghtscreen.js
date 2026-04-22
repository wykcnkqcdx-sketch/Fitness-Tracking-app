import { h } from 'https://esm.sh/preact@10.29.0';
import { useState } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { StrengthForm } from './StrengthForm.js';
import { calcTotalVol } from '../utils.js';
import { dbPut, dbDelete, queueSync, drainSyncQueue } from '../store.js';

export function StrengthScreen(props){
  const str = props.strSessions;
  const setSessions = props.setSessions;
  const [showForm, setShowForm] = useState(false);
  const [selId, setSelId] = useState(null);
  const [editData, setEditData] = useState(null);
  const selSess = selId ? str.find(s => s.id === selId) : str[0];

  // ... (your full saveSession, delete, duplicate logic stays exactly the same)

  return html`<div class="screen">
    <div class="screen-inner">
      ${showForm ? html`<${StrengthForm} initialData=${editData} onSave=${saveSession} onCancel=${()=>{setShowForm(false);setEditData(null);}}/>` :
        html`<button onclick=${()=>{setEditData(null);setShowForm(true);}} class="w-full py-4 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-black font-mono font-bold rounded-3xl mb-6">+ LOG STRENGTH</button>`}
      
      ${selSess && !showForm ? /* your full viewing UI with neon styling */ null : null}
    </div>
  </div>`;
}
