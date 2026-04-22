import { h } from 'https://esm.sh/preact@10.29.0';
import { useState, useEffect } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { dbGetAll } from '../store.js';
import { getSyncConfig, setSyncConfig, drainSyncQueue } from '../store.js';

export function SyncScreen(props) {
  const cfg = getSyncConfig();
  const [url, setUrl] = useState(cfg.url || '');
  const [key, setKey] = useState(cfg.apiKey || '');
  const [msg, setMsg] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    dbGetAll('syncQueue').then(q => setQueueCount(q.length));
  }, []);

  const saveSettings = () => {
    setSyncConfig({ url: url.trim(), apiKey: key.trim() });
    setMsg('Settings saved ✓');
    setTimeout(() => setMsg(''), 2000);
  };

  const syncNow = () => {
    if (!url) { setMsg('Enter URL first'); return; }
    setSyncing(true);
    setMsg('Syncing...');
    drainSyncQueue().then(n => {
      setMsg(n > 0 ? `${n} sessions synced ✓` : 'Nothing to sync');
      setSyncing(false);
    }).catch(e => {
      setMsg('Sync failed: ' + e.message);
      setSyncing(false);
    });
  };

  return html`
    <div class="screen-inner p-4">
      <div class="font-mono text-cyan-400 text-2xl mb-2">GOOGLE SHEETS SYNC</div>
      <div class="text-xs text-slate-400 mb-8">Automatic backup when online</div>

      <div class="bg-slate-950 border border-cyan-400/30 rounded-3xl p-6">
        <div class="mb-6">
          <div class="text-xs font-mono text-cyan-400 mb-2">APPS SCRIPT URL</div>
          <input type="text" value=${url} oninput=${e => setUrl(e.target.value)} 
            class="w-full p-4 bg-slate-900 border border-cyan-400 rounded-2xl font-mono text-sm" placeholder="https://script.google.com/macros/s/..." />
        </div>

        <div class="mb-8">
          <div class="text-xs font-mono text-cyan-400 mb-2">API KEY</div>
          <input type="text" value=${key} oninput=${e => setKey(e.target.value)} 
            class="w-full p-4 bg-slate-900 border border-cyan-400 rounded-2xl font-mono text-sm" placeholder="Your secret key" />
        </div>

        <button onclick=${saveSettings} class="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl mb-4 font-mono">SAVE SETTINGS</button>
        <button onclick=${syncNow} disabled=${syncing} class="w-full py-4 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-black font-bold rounded-2xl">
          ${syncing ? 'SYNCING...' : 'SYNC NOW'}
        </button>
      </div>

      ${msg ? html`<div class="mt-6 text-center font-mono text-sm ${msg.includes('failed') ? 'text-red-400' : 'text-emerald-400'}">${msg}</div>` : null}
    </div>`;
}
