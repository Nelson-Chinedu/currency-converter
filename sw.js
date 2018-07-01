let cache = "currency_converter";
let version = "2.2.2";
let cacheName = `${cache}_${version}`;
let filesToCache = [
    "/currency_converter/",
    "/currency_converter/index.html",
    "/currency_converter/main.js",
    "/currency_converter/style.css",
    "/currency_converter/bootstrap/css/bootstrap.min.css",
    "/currency_converter/bootstrap/css/font-awesome.min.css",
    "/currency_converter/bootstrap/js/bootstrap.min.js",
    "/currency_converter/bootstrap/js/jquery.min.js",
    "/currency_converter/image/banner.jpg",
    "/currency_converter/README.md",
    "https://free.currencyconverterapi.com/api/v5/currencies"
];



self.addEventListener("install", event => {
    console.log("installing service worker");

    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("caching all files");
            cache.addAll(filesToCache);
        }).then(() => self.skipWaiting()).catch(error => console.log("error occured while caching files ==> ", error))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request)
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            Promise.all(
                keyList.map(key => {
                    if (key !== cacheName) {
                        caches.delete(key);
                        console.log(`deleted ${key}`)
                    }
                })
            );
        })
    );
});