import { uid } from './utils.js';

let _db=null;
export function openDB(){
  if(_db)return Promise.resolve(_db);
  return new Promise(function(res,rej){
    const req=indexedDB.open('wemyssworkouts',3);
    req.onupgradeneeded=function(e){
      const db=e.target.result;
      ['strength','cardio','biofeedback','syncQueue','bodycomp','hydration'].forEach(function(name){
        if(!db.objectStoreNames.contains(name)){db.createObjectStore(name,{keyPath:'id'});}
      });
    };
    req.onsuccess=function(e){_db=e.target.result;res(_db);};
    req.onerror=function(e){rej(e.target.error);};
    req.onblocked=function(){rej(new Error('IndexedDB blocked'));};
    setTimeout(function(){ rej(new Error('IndexedDB timeout')); }, 2500);
  });
}
export function dbGetAll(store){return openDB().then(function(db){return new Promise(function(res,rej){const tx=db.transaction(store,'readonly');const req=tx.objectStore(store).getAll();req.onsuccess=function(){res(req.result||[]);};req.onerror=function(){rej(req.error);};});});}
export function dbPut(store,item){return openDB().then(function(db){return new Promise(function(res,rej){const tx=db.transaction(store,'readwrite');const req=tx.objectStore(store).put(item);req.onsuccess=function(){res(req.result);};req.onerror=function(){rej(req.error);};});});}
export function dbDelete(store,id){return openDB().then(function(db){return new Promise(function(res,rej){const tx=db.transaction(store,'readwrite');const req=tx.objectStore(store).delete(id);req.onsuccess=function(){res();};req.onerror=function(){rej(req.error);};});});}

export function getSyncConfig(){try{return JSON.parse(localStorage.getItem('ww_sync')||'{}');}catch(e){return {};}}
export function setSyncConfig(cfg){localStorage.setItem('ww_sync',JSON.stringify(cfg));}
function syncItem(item,cfg){
  if(!cfg.url)return Promise.reject(new Error('No sync URL configured'));
  const payload=Object.assign({},{data:item.data},{apiKey:cfg.apiKey||'',action:item.action});
  return fetch(cfg.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),redirect:'follow'})
    .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(function(j){if(j.error)throw new Error(j.error);return j;});
}
export async function drainSyncQueue(onProgress){
  const cfg=getSyncConfig();
  if(!cfg.url||!navigator.onLine)return Promise.resolve(0);
  
  const items = await dbGetAll('syncQueue');
  if(!items.length) return 0;

  let syncedCount = 0;
  for (const item of items) {
    try {
      await syncItem(item, cfg);
      await dbDelete('syncQueue', item.id);
      syncedCount++;
      if (onProgress) onProgress(syncedCount, items.length);
    } catch (error) {
      console.error('Failed to sync item, will retry later:', item.id, error);
    }
  }
  return syncedCount;
}
export function queueSync(action,data){return dbPut('syncQueue',{id:uid(),action:action,data:data,ts:Date.now()});}