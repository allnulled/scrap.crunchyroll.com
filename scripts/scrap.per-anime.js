// ==UserScript==
// @name     CrunchyRoll | Espec + Profundo
// @version  1
// @grant    none
// ==/UserScript==

if (!window.location.href.startsWith("https://www.crunchyroll.com/")) {
    return;
}

window.get_all_data = async () => {
    const simply_wait = time => new Promise(ok => setTimeout(ok, time));
    const agregar_datos = async function (datos) {
        try {
            const { base, dato, id } = datos;
            const stored_json = localStorage.getItem(base) || "{}";
            const stored = JSON.parse(stored_json);
            stored[id] = dato;
            try {
                localStorage.setItem(base, JSON.stringify(stored));
            } catch(error) {
                if(error.name === "QUOTA_EXCEEDED_ERR") {
                    document.body.innerHTML = "Erroooooor de localstorage.";
                }
            }
        } catch (error) {
            console.log("Falló en envío de datos al servidor local:", error);
        }
    };
    const get_link = async function () {
        try {
            return window.location.href;
        } catch (error) {
            console.log("Error en la ext:", error, "[error:link]");
            return "[error:link]";
        }
    };
    const get_anime_title = async function () {
        try {
            return document.querySelector(".hero-heading-line h1.title").textContent.trim();
        } catch (error) {
            return "[error:title]";
        }
    };
    const get_metatags = async function () {
        try {
            return document.querySelector('[data-t="meta-tags"] span').textContent.trim();
        } catch (error) {
            console.log("Error en la ext:", error, "[error:metatags]");
            return "[error:metatags]";
        }
    };
    const get_rating_score = async function () {
        try {
            return document.querySelector('[data-t="average-rating"] .star-rating-average-data__label--TdvQs').textContent.split(" ")[0].trim();
        } catch (error) {
            console.log("Error en la ext:", error, "[error:rating_score]");
            return "[error:rating_score]";
        }
    };
    const get_rating_audience = async function () {
        try {
            return document.querySelector('[data-t="average-rating"] .star-rating-average-data__label--TdvQs').textContent.split(" ")[1].replace(/^\(|\)$/g, "").trim();
        } catch (error) {
            return "[error:rating_audience]";
        }
    };
    const get_reviews = async function () {
        try {
            return document.querySelector(".star-rating__reviews-link--lkG9-").textContent.trim();
        } catch (error) {
            return "[error:reviews]";
        }
    };
    const get_description = async function () {
        try {
            return document.querySelector(".erc-show-description p").textContent.trim();
        } catch (error) {
            return "[error:description]";
        }
    };
    const get_genres = async function () {
        try {
            return Array.from(document.querySelectorAll(".genres-wrapper .genre-badge a small")).map(e => e.textContent.trim());
        } catch (error) {
            return "[error:genres]";
        }
    };
    const get_editor = async function () {
        try {
            return Array.from(document.querySelectorAll(".show-details-table h5")).filter(el => el.textContent.trim() === "Editor")[0].parentElement.nextElementSibling.querySelector("h5").textContent.trim();
        } catch (error) {
            return "[error:editor]";
        }
    };
    const get_audio = async function () {
        try {
            return Array.from(document.querySelectorAll(".show-details-table h5")).filter(el => el.textContent.trim() === "Audio")[0].parentElement.nextElementSibling.querySelector("h5").textContent.trim();
        } catch (error) {
            return "[error:audio]";
        }
    };
    const get_subtitles = async function () {
        try {
            return Array.from(document.querySelectorAll(".show-details-table h5")).filter(el => el.textContent.trim() === "Subtítulos")[0].parentElement.nextElementSibling.querySelector("h5").textContent.trim().split(",").map(t => t.trim());
        } catch (error) {
            return "[error:subtitles]";
        }
    };
    const get_seasons_elements = async function () {
        try {
            const selector_element = document.querySelector(".erc-season-with-navigation .seasons-select .dropdown-trigger--P--FX");
            if (selector_element === null) {
                const one_season = document.querySelector(".erc-season-with-navigation .seasons-select > h4");
                if (one_season !== null) {
                    return {
                        type: "one",
                        season_id: one_season.textContent.trim()
                    };
                } else {
                    return {
                        type: "unknown"
                    };
                }
            }
            selector_element.click();
            await simply_wait(1000);
            const buttons_selector_id = ".dropdown-content--5b5F7 .select-content__option--gq8Uo";
            const buttons_count = Array.from(document.querySelectorAll(buttons_selector_id)).length;
            selector_element.click();
            return {
                type: "selector",
                selector_element,
                buttons_selector_id: buttons_selector_id,
                buttons_count: buttons_count
            };
        } catch (error) {
            console.log("Error en la ext:", error, "[error:seasons_elements]");
            return "[error:seasons_elements]";
        }
    };
    const get_seasons = async function () {
        try {
            const seasons = [];
            const seasons_elements = await get_seasons_elements();
            if (seasons_elements.type === "selector") {
                for (let index = 0; index < seasons_elements.buttons_count; index++) {
                    try {
                        seasons_elements.selector_element.click();
                        await simply_wait(500);
                        const button_element = Array.from(document.querySelectorAll(seasons_elements.buttons_selector_id))[index];
                        button_element.click();
                        await simply_wait(1000 * 4);
                        const season_data = {
                            season: button_element.textContent.trim(),
                            episodes: await get_season_episodes()
                        };
                        seasons.push(season_data);
                    } catch (error) {
                        console.log("Error en la ext:", error, "[error:seasons:" + index + "]");
                        seasons.push("[error:seasons:" + index + "]");
                    }
                }
            } else if (seasons_elements.type === "one") {
                const season_data = {
                    season: seasons_elements.season_id,
                    episodes: await get_season_episodes()
                };
                seasons.push(season_data);
            } else if (seasons_elements.type === "none") {

            }
            return seasons;
        } catch (error) {
            console.log("Error en la ext:", error, "[error:seasons]");
            return "[error:seasons]";
        }
    };
    const get_episode_elements = async function () {
        try {
            return Array.from(document.querySelectorAll(".erc-season-episode-list .episode-list .erc-playable-collection > .card"));
        } catch (error) {
            console.log("Error en la ext:", error, "[error:episode_ids]");
            return "[error:episode_ids]";
        }
    };
    const get_season_episodes = async function () {
        try {
            const episodes = [];
            const episodes_cards = await get_episode_elements();
            for (let index = 0; index < episodes_cards.length; index++) {
                try {
                    const episode_card = episodes_cards[index];
                    const episode_data = {
                        link: await get_episode_link(episode_card),
                        title: await get_episode_title(episode_card),
                        duration: await get_episode_duration(episode_card),
                        subtitled: await get_episode_is_subtitled(episode_card),
                        comments: await get_episode_comments(episode_card)
                    };
                    episodes.push(episode_data);
                } catch (error) {
                    console.log("Error en la ext:", error, "[error:season_episodes:" + index + "]");
                    seasons.push("[error:season_episodes:" + index + "]");
                }
            }
            return episodes;
        } catch (error) {
            console.log("Error en la ext:", error, "[error:season_episodes]");
            return "[error:season_episodes]";
        }
    };
    const get_episode_link = async function (episode_card) {
        try {
            return episode_card.querySelector(".playable-card-static__link--HjjGe").href;
        } catch (error) {
            console.log("Error en la ext:", error, "[error:episode_link]");
            return "[error:episode_link]";
        }
    };
    const get_episode_title = async function (episode_card) {
        try {
            return episode_card.querySelector(".playable-card-static__link--HjjGe").getAttribute("title");
        } catch (error) {
            console.log("Error en la ext:", error, "[error:episode_title]");
            return "[error:episode_title]";
        }
    };
    const get_episode_duration = async function (episode_card) {
        try {
            return episode_card.querySelector('[data-t="duration-info"]').textContent;
        } catch (error) {
            console.log("Error en la ext:", error, "[error:episode_duration]");
            return "[error:episode_duration]";
        }
    };
    const get_episode_is_subtitled = async function (episode_card) {
        try {
            return episode_card.querySelector('[data-t="meta-tags"]').textContent.trim();
        } catch (error) {
            console.log("Error en la ext:", error, "[error:episode_is_subtitled]");
            return "[error:episode_is_subtitled]";
        }
    };
    const get_episode_comments = async function (episode_card) {
        try {
            return episode_card.querySelector('.comments-count--hwENv').childNodes[0].textContent.trim();
        } catch (error) {
            console.log("Error en la ext:", error, "[error:episode_comments]");
            return "[error:episode_comments]";
        }
    };
    const get_data = async function () {
        try {
            return {
                link: await get_link(),
                title: await get_anime_title(),
                metatags: await get_metatags(),
                rating_score: await get_rating_score(),
                rating_audience: await get_rating_audience(),
                reviews: await get_reviews(),
                description: await get_description(),
                genres: await get_genres(),
                editor: await get_editor(),
                audio: await get_audio(),
                subtitles: await get_subtitles(),
                seasons: await get_seasons(),
            };
        } catch (error) {
            console.log("Error en la ext:", error, "[error:get_data]");
            return "[error:get_data]";
        }
    };

    const all_data = await get_data();
    console.log(all_data);
    await agregar_datos({
        base: "crunchyroll.especifico.profundo",
        dato: all_data,
        id: all_data.title
    });
    window.close();
};
// return;
window.addEventListener("load", () => {
    setTimeout(function () {
        get_all_data();
    }, 1000 * 2);
});