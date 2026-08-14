// v4: o cache anterior pode conter respostas de erro gravadas pelo bug do
// handler de fetch — trocar o nome faz o activate apagar tudo e recomeçar limpo.
const CACHE_NAME = "crm-estudio-v4";
const APP_SHELL = [
  "./index.html",
  "./manifest.json",
  "./logo-mark.svg",
  "./favicon-32.png",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // cacheia cada arquivo individualmente — se um faltar, não trava a instalação inteira
      await Promise.allSettled(
        APP_SHELL.map((url) =>
          fetch(url).then((res) => {
            if (res.ok) return cache.put(url, res);
          }).catch(() => null)
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first para navegação/app shell (sempre busca a versão mais nova quando online),
// cai pro cache se estiver offline. Chamadas ao Firebase/Cloudinary passam direto (não cacheamos dados).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // não intercepta Firebase/Cloudinary

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // só guarda resposta boa: um 404/500 cacheado vira a versão "offline"
        // do app e passa a ser servido no lugar da página real.
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
