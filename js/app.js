/*Cuando hacemos un deploy en desarrollo, encontramos que el / no existe igual al de localhost. */
var url = window.location.href;
var swLocation = '/OTTO_PWA/sw.js';


if ( navigator.serviceWorker ) {

    if ( url.includes('localhost') || url.includes('127.0.0.1') ) {
        swLocation = '/sw.js';
    }

    navigator.serviceWorker.register( swLocation );
}