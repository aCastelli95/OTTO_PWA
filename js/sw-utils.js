/*
Actualizado del cache dinámico.
Puede suceder que solamente actualicemos algunos de los valores y no explicitamente todos,
de esta forma se aplica un PUT como funcion y se recorre la cache para verificar si
concretamente se encuentra ese archivo o no.
*/
function actualizaCacheDinamico( dynamicCache, req, res ) {
    if ( res.ok ) {
        return caches.open( dynamicCache ).then( cache => {
            cache.put( req, res.clone() );
            return res.clone();
        });
    } else {
        return res;
    }
}