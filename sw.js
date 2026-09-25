const CACHE = "cru-v14";  // v11: o proprio texto vira dicionario das palavras erradas
const SHELL = ["/", "/index.html", "/manifest.json", "/icon-180.png", "/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // API passa direto
  // a versao NUNCA sai do cache: e ela que avisa que o resto esta velho
  if (url.pathname === "/versao.json") return;
  // O Safari guarda o HTML por conta propria (cache-control do GitHub Pages) e no
  // iPhone o app instalado reabre a MESMA pagina de memoria, sem navegacao nova:
  // foi assim que um conserto ja publicado passou uma hora sem chegar. Pagina e
  // script vao sempre buscar do servidor, sem passar pelo cache do navegador.
  const documento = e.request.mode === "navigate"
    || /\.(html|js|json)$/.test(url.pathname) || url.pathname === "/";
  e.respondWith(
    fetch(documento ? new Request(e.request, { cache: "no-store" }) : e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
