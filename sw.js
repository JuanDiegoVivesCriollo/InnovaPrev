const CACHE_STATIC='innovaprev-static-v1';
const CACHE_PAGES='innovaprev-pages-v1';
const ASSETS=[
  '/','/index.html','/inicio.html','/sobre-nosotros.html','/servicios.html','/contacto.html',
  '/dist/output.css','/assets/css/fonts.css','/assets/css/fa.min.css',
  '/assets/js/site-common.js','/app.js','/assets/js/anime.min.js',
  '/HeroEmergencia.webp','/Diseñosintítulo.svg'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_STATIC).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>![CACHE_STATIC,CACHE_PAGES].includes(k)).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  const url=new URL(req.url);
  if(req.method!=='GET') return;
  if(url.pathname.endsWith('.html')){
    e.respondWith(
      caches.open(CACHE_PAGES).then(cache=>
        fetch(req).then(res=>{
          cache.put(req,res.clone());
          return res;
        }).catch(()=>cache.match(req)||caches.match('/index.html'))
      )
    );
    return;
  }
  if(ASSETS.includes(url.pathname)){
    e.respondWith(
      caches.match(req).then(cached=>cached||fetch(req).then(res=>{
        const clone=res.clone();caches.open(CACHE_STATIC).then(c=>c.put(req,clone));return res;
      }))
    );
  }
});
