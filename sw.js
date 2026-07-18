const C='goldfarb-austria-v9';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const req=e.request;
  const isDoc=req.mode==='navigate'||req.destination==='document'||req.url.endsWith('/index.html')||req.url.endsWith('/');
  if(isDoc){
    e.respondWith(fetch(req).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{});return resp;}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{});return resp;})));
  }
});
