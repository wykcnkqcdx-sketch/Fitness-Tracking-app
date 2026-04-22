import { h } from 'https://esm.sh/preact@10.29.0';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';

export function Nav(props) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'HOME' },
    { id: 'strength', icon: '💪', label: 'STR' },
    { id: 'cardio', icon: '🏃', label: 'CAR' },
    { id: 'plan', icon: '📋', label: 'PLAN' },
    { id: 'progress', icon: '📈', label: 'STATS' },
    { id: 'body', icon: '⚖️', label: 'BODY' },
    { id: 'sync', icon: '☁️', label: 'SYNC' }
  ];

  const activeIndex = tabs.findIndex(t => t.id === props.tab);

  return html`
    <nav class="nav">
      <div style="position:absolute;top:-6px;left:0;right:0;height:3px;background:linear-gradient(90deg,#00f3ff,#ff00ea);box-shadow:0 0 12px #00f3ff;transform:translateX(${activeIndex * (100/7)}%);transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);"></div>
      ${tabs.map(t => html`
        <button onclick=${() => props.setTab(t.id)}
                class="nav-btn ${props.tab === t.id ? 'active' : ''}">
          <span class="nav-icon">${t.icon}</span>
          <span class="text-[9px] tracking-widest font-mono">${t.label}</span>
        </button>
      `)}
    </nav>`;
}
