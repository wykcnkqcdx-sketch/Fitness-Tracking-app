import { h } from 'https://esm.sh/preact@10.29.0';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';

export function BodyMap(props){
  const selected=props.selected;
  const onSelect=props.onSelect;
  function isActive(part){return selected.has(part);}
  return html`
    <svg width="100%" height="380" viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto;max-width:280px">
      <!-- Silhouette -->
      <ellipse cx="160" cy="55" rx="32" ry="34" fill="var(--bg3)"/>
      <rect x="124" y="95" width="72" height="95" rx="14" fill="var(--bg3)"/>
      <line x1="130" y1="108" x2="78" y2="180" stroke="var(--bg3)" stroke-width="26" stroke-linecap="round"/>
      <line x1="190" y1="108" x2="242" y2="180" stroke="var(--bg3)" stroke-width="26" stroke-linecap="round"/>
      <rect x="124" y="185" width="72" height="25" rx="6" fill="var(--bg3)"/>
      <line x1="138" y1="210" x2="118" y2="320" stroke="var(--bg3)" stroke-width="28" stroke-linecap="round"/>
      <line x1="182" y1="210" x2="202" y2="320" stroke="var(--bg3)" stroke-width="28" stroke-linecap="round"/>
      <line x1="118" y1="320" x2="112" y2="375" stroke="var(--bg3)" stroke-width="22" stroke-linecap="round"/>
      <line x1="202" y1="320" x2="208" y2="375" stroke="var(--bg3)" stroke-width="22" stroke-linecap="round"/>
      
      <!-- Clickable target zones -->
      <circle onclick=${()=>onSelect('shoulders')} cx="128" cy="108" r="16" class="body-part ${isActive('shoulders')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('shoulders')} cx="192" cy="108" r="16" class="body-part ${isActive('shoulders')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('chest')} cx="160" cy="125" r="22" class="body-part ${isActive('chest')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('arms')} cx="90" cy="155" r="16" class="body-part ${isActive('arms')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('arms')} cx="230" cy="155" r="16" class="body-part ${isActive('arms')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('core')} cx="160" cy="175" r="20" class="body-part ${isActive('core')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('back')} cx="160" cy="145" r="18" class="body-part ${isActive('back')?'active':''}" fill="rgba(0,180,255,0.05)" stroke="rgba(0,180,255,0.3)" stroke-width="2" stroke-dasharray="3,3"/>
      <circle onclick=${()=>onSelect('glutes')} cx="160" cy="205" r="16" class="body-part ${isActive('glutes')?'active':''}" fill="rgba(0,180,255,0.05)" stroke="rgba(0,180,255,0.3)" stroke-width="2" stroke-dasharray="3,3"/>
      <circle onclick=${()=>onSelect('quads')} cx="130" cy="260" r="16" class="body-part ${isActive('quads')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('quads')} cx="190" cy="260" r="16" class="body-part ${isActive('quads')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('calves')} cx="113" cy="350" r="12" class="body-part ${isActive('calves')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
      <circle onclick=${()=>onSelect('calves')} cx="207" cy="350" r="12" class="body-part ${isActive('calves')?'active':''}" fill="rgba(0,180,255,0.08)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
    </svg>`;
}
