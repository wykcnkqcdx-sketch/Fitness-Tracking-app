import { h } from 'https://esm.sh/preact@10.29.0';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';

export function BodyMap(props) {
  const selected = props.selected || new Set();
  const onSelect = props.onSelect;
  const isActive = (part) => selected.has(part);

  return html`
    <svg width="100%" height="380" viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" class="mx-auto max-w-[280px]">
      <!-- Silhouette (same as your original) -->
      <ellipse cx="160" cy="55" rx="32" ry="34" fill="#132032"/>
      <rect x="124" y="95" width="72" height="95" rx="14" fill="#132032"/>
      <!-- ... keep all your silhouette lines ... -->
      <!-- Neon clickable zones -->
      <circle onclick=${()=>onSelect('shoulders')} cx="128" cy="108" r="16" class="cursor-pointer ${isActive('shoulders') ? 'fill-cyan-400/40 stroke-cyan-400' : 'fill-transparent stroke-cyan-400/60'}" stroke-width="3"/>
      <!-- Repeat for all other body parts with same class pattern -->
    </svg>`;
}
