/* Service worker khusus admin: selalu ambil versi terbaru dari jaringan,
   cache hanya dipakai kalau sedang offline. Halaman web utama tidak disentuh. */
var V="admin-v1",SHELL=["admin.html","manifest.json","logo.svg","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){
 e.waitUntil(caches.open(V).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(new Request(u,{cache:"reload"})).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){
 e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
 var r=e.request,u=new URL(r.url);
 if(r.method!=="GET"||u.origin!==location.origin)return;
 if(SHELL.indexOf(u.pathname.split("/").pop())<0)return;
 e.respondWith(fetch(r,{cache:"no-store"}).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp)});return res}).catch(function(){return caches.match(r)}))});
