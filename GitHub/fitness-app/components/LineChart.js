import { h } from 'https://esm.sh/preact@10.29.0';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';

export function LineChart(props){
  const data=props.data;
  const labels=props.labels;
  const color=props.color||'var(--blue)';
  if(!data||!data.length)return html`<div style="color:var(--mu);text-align:center;padding:40px;font-size:12px">No data yet</div>`;
  const max=Math.max.apply(null,data.concat([1]));
  const min=Math.min.apply(null,data);
  const range=max-min||1;
  const w=600,h=160,pad=30;
  const points=data.map(function(v,i){
    const x=pad+(i/(data.length-1||1))*(w-pad*2);
    const y=h-pad-((v-min)/range)*(h-pad*2);
    return x+','+y;
  }).join(' ');
  return html`
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:180px">
      <polyline points=${points} fill="none" stroke=${color} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${data.map(function(v,i){
        const x=pad+(i/(data.length-1||1))*(w-pad*2);
        const y=h-pad-((v-min)/range)*(h-pad*2);
        return html`<circle cx=${x} cy=${y} r="5" fill=${color}/>`;
      })}
      ${labels.map(function(l,i){
        const x=pad+(i/(labels.length-1||1))*(w-pad*2);
        return html`<text x=${x} y=${h-8} text-anchor="middle" fill="var(--mu)" font-size="11">${l}</text>`;
      })}
    </svg>`;
}