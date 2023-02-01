# scrap.crunchyroll.com

Scrap del site crunchyroll.com. Más de 1.000 ítems.

## Aplicación

Puedes ir directamente a la aplicación de búsqueda a:

 - [https://allnulled.github.io/scrap.crunchyroll.com](https://allnulled.github.io/scrap.crunchyroll.com/index.html)

## Explicación

### Parte 1:

El scrap ha sido realizado con:
 - Script de servidor:
   - El módulo de NPM: [recolector-web](https://github.com/allnulled/recolector-web)
 - Script de cliente:
   - El addon de [Greasemonkey](https://addons.mozilla.org/ca/firefox/addon/greasemonkey/).
   - El script de [`./scripts/script.general.js`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/scripts/script.general.js).
   - El script de [`./scripts/script.especifico.js`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/scripts/script.especifico.js).

### Parte 2:

En un segundo momento, se ha desarrollado un scrap más profundo para recopilar los datos de todas las temporadas y episodios posibles y otros detalles, mediante [`./scripts/scrap.per-anime.js`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/scripts/scrap.per-anime.js), integrándolo en [Greasemonkey](https://addons.mozilla.org/ca/firefox/addon/greasemonkey/). Dado que la web ha integrado protecciones de [CSP (Content Security Policy)](https://developer.mozilla.org/es/docs/Web/HTTP/CSP) en este lapso de tiempo, hemos desestimado el uso de [recolector-web](https://github.com/allnulled/recolector-web) que antes sí nos había funcionado, puesto que el deshabilitar las protecciones de CSP desde el navegador no ha sido suficiente para *bypasear* dicha protección. Es por esto que el script ahora aplicado no usa el [recolector-web](https://github.com/allnulled/recolector-web), sino [localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage). Esto suponía tener que ir revisando que no fallara el almacenamiento de esta API, disponible ya en [todos los navegadores](https://caniuse.com/?search=localstorage), puesto que tiene un límite de almacenamiento de **5MB** (el scrap ha terminado ocupando **3.9MB**, disponible en [`./datos/datos.acc.json`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/datos/datos.acc.json)).

Como ya teníamos todos los títulos del scrap anterior, se ha creado una aplicación html, [`./scripts/app.starter.html`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/scripts/app.starter.html). Esta aplicación reúne todos los títulos, y los va visitando en intervalos de tiempo prudentes, tanto para no molestar a los servidores, como para no colapsar el navegador con demasiadas pestañas abiertas y funcionando. Cada visita almacena los datos en el `localStorage`. El principal inconveniente de esta técnica, [localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage), frente a la anterior, el [recolector-web](https://github.com/allnulled/recolector-web), era el límite de memoria de **5MB** y el tener que estar pasándonos los datos del navegador a nuestro sistema operativo manualmente (al fichero [`./datos/datos.str.json`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/datos/datos.str.json) concretamente). Por esto, hemos desarrollado también el script [`./scripts/script.datos.acc.js`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/scripts/script.datos.acc.js), para ir mezclando los datos en el fichero [`./datos/datos.acc.json`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/datos/datos.acc.json). Este fichero también tiene la línea para sacar los datos del [localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage) por consola, así como para limpiar la memoria del [localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage), y así procurar no rebasar el límite de **5MB** de esta API.

Finalmente, el [`./scripts/script.to-excel`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/scripts/script.to-excel.js) nos coge los datos acumulados en [`./datos/datos.acc.json`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/datos/datos.acc.json), y nos los adapta para exponerlos en el fichero [`./datos/crunchyroll.com.all.csv`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/datos/crunchyroll.com.all.csv). En él hemos aprovechado para extraer métricas y disponerlas visualmente. Por otro lado, los datos que tienen profundidad, como son las temporadas y episodios (cada episodio está *dentro de* una temporada), han sido omitidos en el fichero `*.csv` final, por limitaciones propias de los ficheros tipo Excel, como es el `*.csv`.


## Notas

 - Las imágenes se han obviado para no molestar demasiado a los servidores de [crunchyroll.com](https://crunchyroll.com).
 - También han sido ignorados los ficheros JSON del proceso del scrap.
 - Igualmente, los datos recopilados están en formato JSON en [`app/crunchyroll.popular.json`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/app/crunchyroll.popular.json) y [`app/crunchyroll.popular.details.json`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/app/crunchyroll.popular.details.json).
 - Los últimos datos recavados están en los ficheros:
   - [`./datos/datos.acc.json`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/datos/datos.acc.json): contiene los datos del último scrap ([`./scripts/scrap.per-anime.js`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/scripts/scrap.per-anime.js)) limpios, tal cual.
   - [`./datos/crunchyroll.com.all.csv`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/datos/crunchyroll.com.all.csv): contiene los datos del último scrap ([`./scripts/scrap.per-anime.js`](https://github.com/allnulled/scrap.crunchyroll.com/blob/main/scripts/scrap.per-anime.js)) adaptados y con algunas métricas extra.

