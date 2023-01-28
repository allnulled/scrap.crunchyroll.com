// ==UserScript==
// @name     CrunchyRoll.com | Scrap específico
// @version  1
// @grant    none
// ==/UserScript==

if (!window.location.href.startsWith("https://www.crunchyroll.com/es-es/series/")) {
    return;
}

setTimeout(async () => {
    try {
        const enviar_datos = async function (datos) {
            try {
                const respuesta = await window.fetch("http://127.0.0.1:9095", {
                    method: "POST",
                    cors: true,
                    body: JSON.stringify(datos),
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                });
                const respuesta_en_texto = await respuesta.text();
                console.log(respuesta_en_texto);
            } catch (error) {
                console.log("Falló en envío de datos al servidor local:", error);
            }
        };
        const $ = (...args) => document.querySelector(...args);
        const $$ = (...args) => Array.from(document.querySelectorAll(...args));
        const title = $(".hero-heading-line h1.title").textContent.trim();
        const rating = $(".star-rating-average-data__label--TdvQs").textContent.trim();
        const metatags = $("[data-t='meta-tags']").textContent.trim();
        const description = $(".expandable-section__text---00oG").textContent.trim();
        const chapters = (() => {
            try {
                return $$(".playable-card-static__title--is-small--ON2lX").map(el => el.textContent);
            } catch (error) {
                return [];
            }
        })();
        const resultado = {
            title,
            rating,
            description,
            chapters,
            metatags,
        };
        await enviar_datos({
            base: "crunchyroll.com",
            dato: resultado,
            id: title
        });
        window.close();
    } catch (error) {
        await enviar_datos({
            base: "crunchyroll.com.errors",
            dato: {
                page: window.location.href,
                error: {
                    name: error.name,
                    message: error.message
                }
            },
        });
    }
}, 4000);