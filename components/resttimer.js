import { h } from 'https://esm.sh/preact@10.29.0';
import { useState, useEffect } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';

export function RestTimer() {
  const [secs, setSecs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [visible, setVisible] = useState(false);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    let id;
    if (isRunning) id = setInterval(() => setSecs(Math.floor((Date.now() - startTime) / 1000)), 200);
    return () => clearInterval(id);
  }, [isRunning, startTime]);

  const toggle = () => {
    if (isRunning) setIsRunning(false);
    else { setStartTime(Date.now() - secs * 1000); setIsRunning(true); }
  };

  const reset = () => { setIsRunning(false); setSecs(0); };

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (!visible) {
    return html`<button onclick=${() => setVisible(true)}
      class="fixed bottom-[90px] right-4 bg-slate-900 border border-cyan-400 text-cyan-400 w-12 h-12 rounded-2xl shadow-[0_0_15px_#00f3ff] flex items-center justify-center text-2xl z-50">⏱️</button>`;
  }

  return html`
    <div class="fixed bottom-[90px] right-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-400 rounded-3xl px-5 py-3 flex items-center gap-4 shadow-[0_0_20px_#00f3ff] z-50">
      <div class="font-mono text-2xl font-bold text-cyan-400 tabular-nums">${fmt(secs)}</div>
      <div class="flex gap-4 border-l border-cyan-400/30 pl-4">
        <button onclick=${toggle} class="text-3xl">${isRunning ? '⏸️' : '▶️'}</button>
        <button onclick=${reset} class="text-3xl">🔄</button>
        <button onclick=${() => {reset();setVisible(false);}} class="text-3xl text-slate-400">✕</button>
      </div>
    </div>`;
}
