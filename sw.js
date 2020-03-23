importScripts("js/sw-utils.js");

const STATIC_CACHE = "static-v1"; // EL corazon de la app esta en esta cache( template, css basicos, etc.)
const DYNAMIC_CACHE = "dynamic-v1"; // Contenido como imagenes o pdf que varian constantementes por mantenimiento de aplicativos
const INMUTABLE_CACHE = "inmutable-v1"; // Contiene todas las urls de librerias externas que no van a cambiar, ejemplo Boostrap

const APP_SHELL = [
  //"/"",
  "index.html",
  "img/otto.ino",
  "img/otto.png",
  "css/style.css",
  "js/app.js",
  "js/style.js",
  "js/sw-utils.js",
  "js/toastr.js",
  "js/events/eventsButtons.js",
  "js/events/eventsBluetooth.js"
  
];

const APP_SHELL_INMUTABLE = [
  "https://use.fontawesome.com/releases/v5.11.2/css/all.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css",
  "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js",
  "https://kit.fontawesome.com/66489ab8da.js",
  "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css"
];

self.addEventListener("install", e => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHELL));

  const cacheInmutable = caches
    .open(INMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE))
    .catch(e => console.log(e));

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

/**Contiene una activacion de los recorridos actualizar. Si encontramos una cache
 * con el titulo de mi version que se deploya en PROD o en la composicion se encuentra
 * que contiene parte de su nombre, entonces la borra.
 * Esto siempre mantiene actualizada solo la estatica
 */
self.addEventListener("activate", e => {
  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }

      if (key !== DYNAMIC_CACHE && key.includes("dynamic")) {
        return caches.delete(key);
      }
    });
  });

  e.waitUntil(respuesta);
});

/**
 * Como indica la palabra, va buscar los elementos que necesita, llamese templates o lo que fuera.
 * Dada las caracteristicas de la Cache dinamica, sucede aveces que algunos elementos, como imagenes o pdf
 * pueden ir variando, ya sean en tamaño, contenido, o lo que fuese. De esta forma, para no tener que traernos nuevamente
 * lo mismo, se evalua actualizar algunas partes de la cache,por eso el actualizarCacheDinamico
 */
self.addEventListener("fetch", e => {
  const respuesta = caches.match(e.request).then(res => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then(newRes => {
        return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
      });
    }
  });

  e.respondWith(respuesta);
});
