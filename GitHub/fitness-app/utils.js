export function hrCol(hr){return hr<95?'#32d74b':hr<110?'#ffd60a':'#ff453a';}
export function zoneName(z){return ['','Recovery','Base Aerobic','Aerobic','Threshold','Max'][z]||'?';}
export function hrZoneFrom(hr){const h=Number(hr);if(!h)return 2;if(h<85)return 1;if(h<100)return 2;if(h<115)return 3;if(h<140)return 4;return 5;}
export function todayISO(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
export function fmtLabel(iso){const d=new Date(iso+'T12:00:00');return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});}
export function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2);}
export function calcVol(sets){return (sets||[]).reduce(function(s,x){return s+(x.weight||0)*(typeof x.reps==='number'?x.reps:0);},0);}
export function calcTotalVol(sess){return (sess.blocks||[]).reduce(function(a,b){return a+calcVol(b.sets);},0);}
export function topWt(sets){const w=(sets||[]).map(function(s){return s.weight||0;});return w.length?Math.max.apply(null,w):0;}
export function epley(weight,reps){if(!weight||typeof reps!=='number'||reps<1)return 0;return Math.round(weight*(1+reps/30));}

export const SEED_STR=[
  {id:'s1',date:'2026-03-30',label:'Mon 30 Mar',warmup:'Indoor Row 5 min',blocks:[
    {name:'Bench Press',sets:[{weight:40,reps:12},{weight:45,reps:10},{weight:50,reps:8},{weight:55,reps:6}]},
    {name:'Bent Over Row',sets:[{weight:25,reps:12},{weight:35,reps:10},{weight:70,reps:8},{weight:80,reps:6}]},
    {name:'Military Press',sets:[{weight:20,reps:12},{weight:30,reps:10},{weight:35,reps:8},{weight:40,reps:6}]},
    {name:'KB Squat Clean & Press',sets:[{weight:16,reps:'10 E/S'},{weight:16,reps:'10 E/S'},{weight:16,reps:'10 E/S'}]},
    {name:'KB Swings',sets:[{weight:20,reps:20},{weight:20,reps:20},{weight:20,reps:20}]}
  ]},
  {id:'s2',date:'2026-04-16',label:'Thu 16 Apr',warmup:'Row 5 min',blocks:[
    {name:'KB Cleans',sets:[{weight:20,reps:10},{weight:20,reps:10},{weight:20,reps:10}]},
    {name:'KB Swings',sets:[{weight:20,reps:10},{weight:20,reps:10},{weight:20,reps:10}]},
    {name:'Deadlift',sets:[{weight:60,reps:12},{weight:60,reps:10},{weight:70,reps:8},{weight:70,reps:8}]},
    {name:'Bent Over Row',sets:[{weight:60,reps:12},{weight:60,reps:10},{weight:70,reps:8},{weight:70,reps:8}]},
    {name:'Military Press',sets:[{weight:20,reps:12},{weight:30,reps:10},{weight:30,reps:10}]},
    {name:'Bicep Curl',sets:[{weight:30,reps:12},{weight:30,reps:8},{weight:20,reps:8}]},
    {name:'Tricep Extension',sets:[{weight:15,reps:12},{weight:17.5,reps:12},{weight:17.5,reps:12}]},
    {name:'Lat Pulldown',sets:[{weight:39,reps:12},{weight:39,reps:12},{weight:39,reps:12}]}
  ]}
];
export const SEED_CAR=[
  {id:'c1',date:'2026-04-01',label:'Wed 1 Apr',type:'Walk / Hike',duration:'45:31',distanceKm:3.51,elevationM:69,avgPace:"12'57\"/km",avgHR:91,maxHR:115,activeKcal:224,totalKcal:305,effortLabel:'Easy',effortScore:3,hrZone:2,splits:[{km:1,time:'12:07',pace:"12'07\"",hr:85},{km:2,time:'15:00',pace:"15'00\"",hr:88},{km:3,time:'11:11',pace:"11'11\"",hr:94},{km:4,time:'06:39',pace:"12'59\"",hr:97}]},
  {id:'c2',date:'2026-04-07',label:'Tue 7 Apr',type:'Run',duration:'45:01',distanceKm:7.21,elevationM:62,avgPace:"6'14\"/km",avgHR:145,maxHR:162,activeKcal:532,totalKcal:612,effortLabel:'Hard',effortScore:7,hrZone:4,splits:[{km:1,time:'05:48',pace:"5'48\"",hr:72},{km:2,time:'06:06',pace:"6'06\"",hr:136},{km:3,time:'06:19',pace:"6'19\"",hr:143},{km:4,time:'06:15',pace:"6'15\"",hr:148},{km:5,time:'06:10',pace:"6'10\"",hr:149}]},
  {id:'c3',date:'2026-04-16',label:'Thu 16 Apr',type:'Strength Training',duration:'36:04',distanceKm:0,elevationM:0,avgPace:'-',avgHR:116,maxHR:144,activeKcal:193,totalKcal:257,effortLabel:'Easy',effortScore:2,hrZone:3,splits:[]}
];

export const PLAN=[
  {wk:1,block:'B1',phase:'Hypertrophy',note:'4×8-10 @ 70-75%',mon:'Push STR',tue:'Pull STR + Run',wed:'Legs+KB+Z2',thu:'Depletion #1',fri:'Depletion #2',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:2,block:'B1',phase:'Hypertrophy',note:'4×9 @ 70-75%',mon:'Push STR',tue:'Pull STR + Run',wed:'Legs+KB+Z2',thu:'Depletion #1',fri:'Depletion #2',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:3,block:'B1',phase:'Hypertrophy',note:'4×10 @ 72-77%',mon:'Push STR',tue:'Pull STR + Run',wed:'Legs+KB+Z2',thu:'Depletion #1',fri:'Depletion #2',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:4,block:'DL',phase:'DELOAD',note:'-50% volume · maintenance cals',mon:'Light 2×8',tue:'Light 2×8',wed:'Mobility',thu:'Rest',fri:'Z2 Walk',sat:'Light Full',sun:'Rest'},
  {wk:5,block:'B2',phase:'Str-Hyp DUP',note:'5×5 @ 78-82%',mon:'Push 5×5',tue:'Pull 5×5 + Run',wed:'Legs+KB+Z2',thu:'Depletion #1',fri:'Depletion #2',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:6,block:'B2',phase:'Str-Hyp DUP',note:'5×5 @ 82-87%',mon:'Push 5×5',tue:'Pull 5×5 + Run',wed:'Legs+KB+Z2',thu:'Depletion #1',fri:'Depletion #2',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:7,block:'B2',phase:'Str-Hyp DUP',note:'5×5 @ 85-87%',mon:'Push 5×5',tue:'Pull 5×5 + Run',wed:'Legs+KB+Z2',thu:'Depletion #1',fri:'Depletion #2',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:8,block:'DL',phase:'DELOAD',note:'-40% volume · maintenance cals',mon:'Light 3×5',tue:'Light 3×5',wed:'Mobility',thu:'Rest',fri:'Z2 Walk',sat:'Light Full',sun:'Rest'},
  {wk:9,block:'B3',phase:'Peak Strength',note:'3×3 @ 85-90%',mon:'Push 3×3',tue:'Pull 3×3 + Run',wed:'Legs+KB+Z2',thu:'Dep 5 rounds',fri:'Dep 5 rounds',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:10,block:'B3',phase:'Peak Strength',note:'3×3 @ 88-92%',mon:'Push 3×3',tue:'Pull 3×3 + Run',wed:'Legs+KB+Z2',thu:'Dep 5 rounds',fri:'Dep 5 rounds',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:11,block:'B3',phase:'Peak Strength',note:'3×3 @ 90-95%',mon:'Push 3×3',tue:'Pull 3×3 + Run',wed:'Legs+KB+Z2',thu:'Dep 5 rounds',fri:'Dep 5 rounds',sat:'Tension/Power',sun:'Rest + Z2'},
  {wk:12,block:'TST',phase:'TESTING',note:'New maxes · compare vs baseline',mon:'New maxes',tue:'New maxes',wed:'Light',thu:'Light',fri:'Light',sat:'Max test',sun:'Rest'}
];
export function currentPlanWeek(strSessions){if(!strSessions.length)return 1;const sorted=strSessions.slice().sort(function(a,b){return a.date>b.date?1:-1;});const first=new Date(sorted[0].date+'T12:00:00');const now=new Date();const diff=Math.floor((now-first)/(7*24*60*60*1000));return Math.min(12,Math.max(1,diff+1));}

export const EXERCISE_LIB={
  'Compound':['Bench Press','Back Squat','Front Squat','Deadlift','Bent Over Row','Military Press','Overhead Press','Incline Bench','Weighted Dip','Weighted Pull-up','Romanian Deadlift','Power Clean'],
  'Kettlebell':['KB Swings','KB Cleans','KB Squat Clean & Press','KB Snatch','KB Turkish Get-Up','KB Goblet Squat','KB Floor Press','KB Windmill'],
  'Isolation':['Bicep Curl','Tricep Extension','Lat Pulldown','Cable Row','Dumbbell Fly','Rear Delt Fly','Lateral Raise','Meadows Row','Leg Extension','Leg Curl','Face Pull'],
  'Unilateral':['Bulgarian Split Squat','Walking Lunge','Single-Leg RDL','Single-Leg Squat','Pistol Squat','Single-Arm DB Row'],
  'Core':['Plank','Side Plank','Hanging Leg Raise','Knees to Chest','Barbell Rollout','Pallof Press','Russian Twist','Ab Wheel','Dead Bug','Bird Dog']
};
export const CARDIO_TYPES=['Run','Walk / Hike','Cycle','Row','Swim','Strength Training','HIIT','Other'];
export const EFFORT_LBL=['','Very Easy','Easy','Moderate','Moderate','Hard','Hard','Very Hard','Very Hard','Max','Max'];