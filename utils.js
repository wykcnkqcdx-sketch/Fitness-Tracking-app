export function showToast(msg, type = 'error') {
  const existing = document.querySelector('.bb-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `bb-toast toast-${type}`;
  toast.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: ${type === 'error' ? 'rgba(248,113,113,0.95)' : 'rgba(74,222,128,0.95)'};
    color: white; padding: 12px 20px; border-radius: 8px; font-weight: 600;
    font-size: 14px; font-family: inherit; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000; max-width: 90vw; backdrop-filter: blur(10px);
    animation: slideDown 0.3s cubic-bezier(0.4,0,0.2,1);
  `;
  toast.textContent = type === 'error' ? '⚠️ ' + msg : '✅ ' + msg;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// Missing exports needed by app.js and components
export const SEED_STR = [
  {
    id: 'seed-str-1',
    date: '2024-01-01',
    label: 'Jan 1',
    warmup: 'Row 5min',
    blocks: [
      {
        name: 'Bench Press',
        target: '8x3 @ RPE8',
        sets: [{weight: 80, reps: 3}, {weight: 80, reps: 3}, {weight: 80, reps: 3}]
      }
    ]
  }
];

export const SEED_CAR = [
  {
    id: 'seed-car-1',
    date: '2024-01-01',
    label: 'Jan 1',
    type: 'Run',
    duration: '30:00',
    distanceKm: 5,
    avgHR: 145,
    hrZone: 3
  }
];

export const PLAN = [
  {
    phase: 'Build',
    mon: 'Strength A',
    tue: 'Cardio 45min',
    wed: 'Strength B',
    thu: 'Rest',
    fri: 'Strength C',
    sat: 'Cardio 60min',
    sun: 'Rest',
    note: 'Week 1 Focus: Volume ramp'
  },
  // ... repeat for 12 weeks
];

export function currentPlanWeek(sessions) {
  // Stub - always week 1
  return 1;
}

export function calcTotalVol(session) {
  return session.blocks ? session.blocks.reduce((a, b) => a + b.sets.reduce((s, set) => s + (set.weight * set.reps || 0), 0), 0) : 0;
}

export const EXERCISE_LIB = {
  Push: ['Bench Press', 'Overhead Press'],
  Pull: ['Row', 'Pullup'],
  Legs: ['Squat', 'Deadlift']
};

export const CARDIO_TYPES = ['Run', 'Walk', 'Bike', 'Row', 'Swim', 'Other'];

export const EFFORT_LBL = ['Rest', 'Very Easy', 'Easy', 'Steady', 'Moderate', 'Working', 'Strong', 'Hard', 'Very Hard', 'Near Max', 'Max'];

export const todayISO = () => new Date().toISOString().split('T')[0];
export const fmtLabel = (iso) => new Date(iso).toLocaleDateString('en-CA');
export const uid = () => Math.random().toString(36).slice(2);

export function hrCol(hr) {
  return hr < 120 ? 'green' : hr < 160 ? 'orange' : 'red';
}

export function hrZoneFrom(avgHR) {
  return Math.floor(avgHR / 20);
}

// Missing utils required by components
export function zoneName(zone) {
  const zones = ['Rest', 'Warm Up', 'Fat Burn', 'Aerobic', 'Anaerobic', 'Max'];
  return zones[zone] || 'Max';
}

export function calcVol(sets) {
  if (!sets) return 0;
  return sets.reduce((a, b) => a + ((b.weight || 0) * (b.reps || 0)), 0);
}

export function topWt(sets) {
  if (!sets) return 0;
  return sets.reduce((max, s) => Math.max(max, s.weight || 0), 0);
}

export function epley(w, r) {
  if (!w || !r) return 0;
  if (r === 1) return w;
  return Math.round(w * (1 + r / 30));
}
