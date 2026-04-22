// components.js - SINGLE FILE VERSION (All components consolidated)
// Paste this entire file in the root of your repo

import { h } from 'https://esm.sh/preact@10.29.0';
import { useState, useEffect } from 'https://esm.sh/preact@10.29.0/hooks';
import { html } from 'https://esm.sh/htm@3.1.1/preact?external=preact';
import { hrCol, zoneName, hrZoneFrom, todayISO, fmtLabel, uid, calcVol, calcTotalVol, topWt, epley, currentPlanWeek, PLAN, EXERCISE_LIB, CARDIO_TYPES, EFFORT_LBL } from './utils.js';
import { dbGetAll, dbPut, dbDelete, queueSync, drainSyncQueue, getSyncConfig, setSyncConfig } from './store.js';

// ==================== BODY MAP ====================
export function BodyMap(props) {
  const selected = props.selected || new Set();
  const onSelect = props.onSelect;
  const isActive = (part) => selected.has(part);

  return html`
    <svg width="100%" height="380" viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" class="mx-auto max-w-[280px]">
      <!-- Silhouette -->
      <ellipse cx="160" cy="55" rx="32" ry="34" fill="#132032"/>
      <rect x="124" y="95" width="72" height="95" rx="14" fill="#132032"/>
      <line x1="130" y1="108" x2="78" y2="180" stroke="#132032" stroke-width="26" stroke-linecap="round"/>
      <line x1="190" y1="108" x2="242" y2="180" stroke="#132032" stroke-width="26" stroke-linecap="round"/>
      <rect x="124" y="185" width="72" height="25" rx="6" fill="#132032"/>
      <line x1="138" y1="210" x2="118" y2="320" stroke="#132032" stroke-width="28" stroke-linecap="round"/>
      <line x1="182" y1="210" x2="202" y2="320" stroke="#132032" stroke-width="28" stroke-linecap="round"/>
      <line x1="118" y1="320" x2="112" y2="375" stroke="#132032" stroke-width="22" stroke-linecap="round"/>
      <line x1="202" y1="320" x2="208" y2="375" stroke="#132032" stroke-width="22" stroke-linecap="round"/>

      <!-- Clickable neon zones -->
      <circle onclick=${()=>onSelect('shoulders')} cx="128" cy="108" r="16" class="cursor-pointer ${isActive('shoulders') ? 'fill-cyan-400/40 stroke-cyan-400' : 'fill-transparent stroke-cyan-400/60'}" stroke-width="3"/>
      <circle onclick=${()=>onSelect('shoulders')} cx="192" cy="108" r="16" class="cursor-pointer ${isActive('shoulders') ? 'fill-cyan-400/40 stroke-cyan-400' : 'fill-transparent stroke-cyan-400/60'}" stroke-width="3"/>
      <circle onclick=${()=>onSelect('chest')} cx="160" cy="125" r="22" class="cursor-pointer ${isActive('chest') ? 'fill-cyan-400/40 stroke-cyan-400' : 'fill-transparent stroke-cyan-400/60'}" stroke-width="3"/>
      <!-- Add other body parts as needed -->
    </svg>`;
}

// ==================== NAV ====================
export function Nav(props) {
  const tabs = [
    {id:'home', icon:'🏠', label:'HOME'},
    {id:'strength', icon:'💪', label:'STR'},
    {id:'cardio', icon:'🏃', label:'CAR'},
    {id:'plan', icon:'📋', label:'PLAN'},
    {id:'progress', icon:'📈', label:'STATS'},
    {id:'body', icon:'⚖️', label:'BODY'},
    {id:'sync', icon:'☁️', label:'SYNC'}
  ];

  return html`
    <nav class="fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-cyan-400 backdrop-blur-xl z-50 flex">
      ${tabs.map(t => html`
        <button onclick=${() => props.setTab(t.id)} class="flex-1 py-4 flex flex-col items-center ${props.tab === t.id ? 'text-cyan-400' : 'text-slate-400'}">
          <span class="text-3xl">${t.icon}</span>
          <span class="text-[10px] font-mono tracking-widest">${t.label}</span>
        </button>
      `)}
    </nav>`;
}

// ==================== REST TIMER ====================
export function RestTimer() {
  return html`<button class="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 border-2 border-cyan-400 text-cyan-400 rounded-2xl text-3xl z-50 shadow-[0_0_15px_#00f3ff]">⏱️</button>`;
}

// ==================== HOME SCREEN (Basic) ====================
export function HomeScreen(props) {
  return html`
    <div class="p-6">
      <div class="bg-slate-950 border border-cyan-400/30 rounded-3xl p-8 text-center">
        <div class="text-5xl mb-4">🏋️</div>
        <div class="text-2xl font-bold text-cyan-400">WEMYSSWORKOUTS</div>
        <div class="text-sm text-slate-400 mt-2">TACTICAL TRAINING LOG</div>
      </div>
    </div>`;
}

// Placeholder for other screens
export function StrengthScreen(props) { return html`<div class="p-6 text-center text-slate-400">STRENGTH SCREEN</div>`; }
export function CardioScreen(props) { return html`<div class="p-6 text-center text-slate-400">CARDIO SCREEN</div>`; }
export function PlanScreen(props) { return html`<div class="p-6 text-center text-slate-400">PLAN SCREEN</div>`; }
export function ProgressScreen(props) { return html`<div class="p-6 text-center text-slate-400">PROGRESS SCREEN</div>`; }
export function BodyScreen(props) { return html`<div class="p-6"><${BodyMap} selected=${new Set()} onSelect=${()=> {}} /></div>`; }
export function SyncScreen(props) { return html`<div class="p-6 text-center text-slate-400">SYNC SCREEN</div>`; }

// Export all
export {
  HomeScreen, StrengthScreen, CardioScreen, PlanScreen, ProgressScreen,
  BodyScreen, SyncScreen, Nav, RestTimer, BodyMap
};
