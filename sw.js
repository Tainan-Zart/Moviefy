const { cache } = require("react")

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open("Moviefy-cache").then((cache) => {
            return cache.addAll(
                [
                    './',
                    './index.html',
                    './src/pages/home.html',
                    './src/pages/homeAdmin.html',
                    './src/pages/login.html',
                    './src/json/manifest.json',
                    './src/json/dadosIniciais.json',
                    './src/scripts/db.js',
                    './src/scripts/home.js',
                    './src/scripts/homeAdmin.js',
                    './src/scripts/login.js',
                    './src/assets/lapis.png',
                    './src/assets/lixeira.png',
                    './src/assets/logo.png',
                    './src/assets/moviefy.png',
                    'https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js',
                    'https://cdn.tailwindcss.com',
                ]
            )
        })
    )
});

self.addEventListener("fetch", (e) => {
   e.respondWith(
    cache.match(e.request).then((res) => res || fetch(e.request))
   );
})