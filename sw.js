/* ============================================================
   Service Worker — منتجعات ماربيلا
   Cache-first للصفحات والأصول، أوفلاين مع رسالة تحديث
   ============================================================ */
const CACHE = "marbella-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./faq.html",
  "./cancellation-policy.html",
  "./unit-details.html",
  "./admin.html",
  "./css/style.css",
  "./css/admin.css",
  "./js/data.js",
  "./js/shared.js",
  "./js/app.js",
  "./js/admin.js",
  "./manifest.json",
  "./assets/images/logo.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ).then(()=>self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  // موارد خارجية (خرائط جوجل): شبكة فقط
  if (url.origin !== location.origin) {
    e.respondWith(fetch(e.request).catch(()=>caches.match("./index.html")));
    return;
  }

  const req = e.request;
  // ملفات الكود (HTML/JS/CSS): شبكة أولاً لضمان أحدث إصدار، ثم الكاش
  const isCode = /\.(html|js|css)$/.test(url.pathname) || url.pathname === "/" || url.pathname === "/index.html";
  if (isCode) {
    e.respondWith(
      fetch(req).then(networkRes => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return networkRes;
      }).catch(() => caches.match(req).then(c => c || caches.match("./index.html")))
    );
    return;
  }

  // باقي الأصول (صور، أيقونات): كاش أولاً
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(networkRes => {
      if (networkRes && networkRes.status === 200) {
        const clone = networkRes.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
      }
      return networkRes;
    }).catch(()=>caches.match("./index.html")))
  );
});
