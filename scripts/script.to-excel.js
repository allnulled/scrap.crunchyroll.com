const datos_json_obj = require(__dirname + "/../datos/datos.acc.json");
const datos_json = Object.values(datos_json_obj);
const get_property = function (tree, selector, default_value) {
    let treeCopy = tree;
    try {
        while (selector.length !== 0) {
            treeCopy = treeCopy[selector.shift()];
        }
    } catch (error) {
        return default_value;
    }
    return treeCopy;
};
const sort_properties = function sortObjectByKeyNameList(object, sortWith) {
    let keys;
    let sortFn;
    if (typeof sortWith === 'function') {
        sortFn = sortWith;
    } else {
        keys = sortWith;
    }
    let objectKeys = Object.keys(object);
    return (keys || []).concat(objectKeys.sort(sortFn)).reduce(function (total, key) {
        if (objectKeys.indexOf(key) !== -1) {
            total[key] = object[key];
        }
        return total;
    }, Object.create(null));
};
const has_array_item = function (arr, item, value_yes = "Sí", value_no = "-") {
    try {
        return arr.indexOf(item) !== -1 ? value_yes : value_no;
    } catch(error) {
        return value_no;
    }
};
Listar_datos_expandidos_y_homogeneizar_campos: {
    // Comentar para ver campos:
    // break Listar_datos_expandidos_y_homogeneizar_campos;
    const errores = [];
    const valores_de_genres = [];
    const valores_de_audio = [];
    const valores_de_subtitles = [];
    for (let index = 0; index < datos_json.length; index++) {
        const dato = datos_json[index];
        Subvalores_de_genres: {
            if(!Array.isArray(dato.genres)) {
                errores.push("El «*.genre» no es un array en: " + dato.title);
                break Subvalores_de_genres;
            }
            const claves = dato.genres;
            for (let index2 = 0; index2 < claves.length; index2++) {
                const clave = claves[index2];
                if (valores_de_genres.indexOf(clave) === -1) {
                    valores_de_genres.push(clave);
                }
            }
        }
        Subvalores_de_audio: {
            let claves_previo = dato.audio;
            if (typeof dato.audio !== "string") {
                errores.push("El «*.audio» no es un string en: " + dato.title);
                break Subvalores_de_audio;
            } else if(dato.audio === "[error:audio]") {
                datos_json[index].audio = [];
                break Subvalores_de_audio;
            }
            const claves = claves_previo.split(",").map(t => t.trim());
            // @MODIFICACION: MODIFICAMOS dato.audio para pasarlo a array:
            datos_json[index].audio = claves;
            for (let index2 = 0; index2 < claves.length; index2++) {
                const clave = claves[index2];
                if (valores_de_audio.indexOf(clave) === -1) {
                    valores_de_audio.push(clave);
                }
            }
        }
        Subvalores_de_subtitles: {
            let claves = dato.subtitles;
            if (!Array.isArray(dato.subtitles)) {
                if(dato.subtitles === "[error:subtitles]") {
                    claves = [];
                    // @MODIFICACION: MODIFICAMOS dato.audio para pasarlo a array:
                    datos_json[index].subtitles = claves;
                } else {
                    errores.push(["El «*.subtitles» no es un array en: " + dato.title, dato.subtitles]);
                    break Subvalores_de_subtitles;
                }
            }
            for (let index2 = 0; index2 < claves.length; index2++) {
                const clave = claves[index2];
                if (valores_de_subtitles.indexOf(clave) === -1) {
                    valores_de_subtitles.push(clave);
                }
            }
        }
        Homogeneizacion_de_rating_audience: {
            let rating_audience = dato.rating_audience;
            if(typeof rating_audience !== "string") {
                errores.push(["El «*.rating_audience» no es un string en: " + dato.title, dato.rating_audience]);
                break Homogeneizacion_de_rating_audience;
            }
            if(rating_audience.endsWith("k")) {
                rating_audience = rating_audience.replace(/k$/g, "").trim();
                rating_audience = parseInt(rating_audience);
                if(Number.isNaN(rating_audience) === true) {
                    errores.push(["El «*.rating_audience» no es un string pasable a número (1) en: " + dato.title, dato.rating_audience]);
                    break Homogeneizacion_de_rating_audience;
                }
                rating_audience = rating_audience * 1000;
            } else {
                rating_audience = parseInt(rating_audience);
                if (Number.isNaN(rating_audience) === true) {
                    errores.push(["El «*.rating_audience» no es un string pasable a número (2) en: " + dato.title, dato.rating_audience]);
                    break Homogeneizacion_de_rating_audience;
                }
            }
            if (Number.isNaN(rating_audience) === true) {
                errores.push(["El «*.rating_audience» no es un string pasable a número (3) en: " + dato.title, dato.rating_audience]);
                break Homogeneizacion_de_rating_audience;
            }
            datos_json[index].rating_audience = rating_audience;
        }
        Homogeneizacion_de_reviews: {
            let reviews = dato.reviews;
            if(typeof reviews !== "string") {
                errores.push(["El «*.reviews» no es un string en: " + dato.title, dato.reviews]);
                break Homogeneizacion_de_reviews;
            } else if(reviews === "[error:reviews]") {
                errores.push(["El «*.reviews» no es un string pasable a número (1) en: " + dato.title, dato.reviews]);
                break Homogeneizacion_de_reviews;
            }
            reviews = parseInt(reviews.replace("Reseñas", "").replace("Reseña", "").trim());
            if(reviews === "") {
                reviews = "0";
            }
            if(Number.isNaN(reviews)) {
                errores.push(["El «*.reviews» no es un string pasable a número (2) en: " + dato.title, dato.reviews]);
                break Homogeneizacion_de_reviews;
            }
            datos_json[index].reviews = reviews;
        }
    }
    if (errores.length) {
        console.log("Se detectaron anomalías:");
        console.log(errores);
        return;
    }
    console.log(valores_de_genres);
    console.log(valores_de_audio);
    console.log(valores_de_subtitles);
    /* RESULTADO:
    // :available genres: //
    [
        'Acción',       'Ciencia Ficción',
        'Drama',        'Fantasia',
        'Sobrenatural', 'Comedia',
        'Romance',      'Seinen',
        'Thriller',     'Musical',
        'Aventura',     'Shounen',
        'Shoujo',       'Deportes'
    ]
    // :available audio: //
    [
        'Japonés',
        'English',
        'Español (América Latina)',
        'Français',
        'Português (Brasil)',
        'Deutsch',
        'Русский',
        'Español (España)',
        'Italiano',
        'العربية',
        'हिंदी',
        'English (India)'
    ]
    // :available subtitles: //
    [
        'Español (España)',
        'English',
        'Deutsch',
        'Español (América Latina)',
        'Français',
        'Italiano',
        'Português (Brasil)',
        'Русский',
        'العربية',
        'हिंदी',
        'Português (Portugal)'
    ]
    //*/
    // return;
}
const get_duration_minutes = function(duration) {
    try {
        let duration_expanded = duration;
        if (typeof duration_expanded !== "string") {
            console.log("Falló la duration en algún ítem");
            process.exit(0);
        }
        if(duration_expanded.indexOf("m") === -1) {
            if ((duration_expanded.indexOf("h") !== -1) && (duration_expanded.indexOf("s") !== -1)) {
                console.log("Falló la duration en algún ítem porque tiene h y s pero no m");
                process.exit(0);
            }
            if (duration_expanded.indexOf("h") !== -1) {
                duration_expanded = duration_expanded + " 0m";
            } else if (duration_expanded.indexOf("s") !== -1) {
                duration_expanded = "0m " + duration_expanded;
            }
        }
        if(duration_expanded.indexOf("h") === -1) {
            duration_expanded = "0h " + duration_expanded;
        }
        if(duration_expanded.indexOf("s") === -1) {
            duration_expanded = duration_expanded + " 0s";
        }
        const [ horas, minutos, segundos ] = duration_expanded.split(/ +/g).map(it => parseInt(it.replace(/[^0-9]+/g, "")));
        return Math.round(((horas * 60 * 60) + (minutos * 60) + segundos) / 60);
    } catch(error) {
        return 0;
    }
};
const datos_json_expandidos = [];
for (let index = 0; index < datos_json.length; index++) {
    const dato = datos_json[index];
    const dato_expandido = ((item) => {
        const item2 = Object.assign({}, item);
        const item_expandido = {
            "audio.English": has_array_item(item.audio, "English", "true", "-"),
            "audio.English (India)": has_array_item(item.audio, "English (India)", "true", "-"),
            "audio.Español (España)": has_array_item(item.audio, "Español (España)", "true", "-"),
            "audio.Español (América Latina)": has_array_item(item.audio, "Español (América Latina)", "true", "-"),
            "audio.Français": has_array_item(item.audio, "Français", "true", "-"),
            "audio.Português (Brasil)": has_array_item(item.audio, "Português (Brasil)", "true", "-"),
            "audio.Italiano": has_array_item(item.audio, "Italiano", "true", "-"),
            "audio.Deutsch": has_array_item(item.audio, "Deutsch", "true", "-"),
            "audio.Japonés": has_array_item(item.audio, "Japonés", "true", "-"),
            "audio.Русский": has_array_item(item.audio, "Русский", "true", "-"),
            "audio.العربية": has_array_item(item.audio, "العربية", "true", "-"),
            "audio.हिंदी": has_array_item(item.audio, "हिंदी", "true", "-"),
            "subtitles.Español (España)": has_array_item(item.audio, "Español (España)", "true", "-"),
            "subtitles.English": has_array_item(item.audio, "English", "true", "-"),
            "subtitles.Deutsch": has_array_item(item.audio, "Deutsch", "true", "-"),
            "subtitles.Español (América Latina)": has_array_item(item.audio, "Español (América Latina)", "true", "-"),
            "subtitles.Français": has_array_item(item.audio, "Français", "true", "-"),
            "subtitles.Italiano": has_array_item(item.audio, "Italiano", "true", "-"),
            "subtitles.Português (Brasil)": has_array_item(item.audio, "Português (Brasil)", "true", "-"),
            "subtitles.Русский": has_array_item(item.audio, "Русский", "true", "-"),
            "subtitles.العربية": has_array_item(item.audio, "العربية", "true", "-"),
            "subtitles.हिंदी": has_array_item(item.audio, "हिंदी", "true", "-"),
            "subtitles.Português (Portugal)": has_array_item(item.audio, "Português (Portugal)", "true", "-"),
        };
        const dato_final = Object.assign({}, item2, item_expandido);
        dato_final.description = dato_final.description.replace(/[\n\t\r ]+/g, " ");
        const seasons_data = (() => {
            const data = {
                total_seasons: 0,
                total_episodes: 0,
                total_duration: 0,
                episodes_duration_average: 0,
            }
            try {
                for(let index = 0; index < dato_final.seasons.length; index++) {
                    const season = dato_final.seasons[index];
                    const episodes = season.episodes;
                    data.total_seasons++;
                    for(let index = 0; index < episodes.length; index++) {
                        const episode = episodes[index];
                        data.total_episodes++;
                        const duration = get_duration_minutes(episode.duration);
                        data.total_duration += duration;
                    }
                }
                data.episodes_duration_average = Math.round(data.total_duration / data.total_episodes);
                data.episodes_duration_average = Number.isNaN(data.episodes_duration_average) ? 0 : data.episodes_duration_average;
                return data;
            } catch(error) {
                console.log(error);
                console.log(dato_final.seasons);
                process.exit(0);
                return data;
            }
        })();
        delete dato_final.seasons;
        seasons_data["total_duration (minutes)"] = seasons_data.total_duration;
        seasons_data["episodes_duration_average (minutes)"] = seasons_data.episodes_duration_average;
        delete seasons_data.total_duration;
        delete seasons_data.episodes_duration_average;
        Object.assign(dato_final, seasons_data);
        // TOTAL DE SEASONS
        // TOTAL DE EPISODIOS
        // TOTAL DE DURACIÓN MEDIA DE EPISODIOS
        return sort_properties(dato_final, [
            "title",
            "metatags",
            "rating_score",
            "rating_audience",
            "reviews",
            "total_seasons",
            "total_episodes",
            "total_duration (minutes)",
            "episodes_duration_average (minutes)",
            "audio",
            "subtitles",
            "seasons",
            "audio.Español (España)",
            "audio.Español (América Latina)",
            "audio.English",
            "audio.English (India)",
            "audio.Français",
            "audio.Português (Brasil)",
            "audio.Italiano",
            "audio.Deutsch",
            "audio.Japonés",
            "audio.Русский",
            "audio.العربية",
            "audio.हिंदी",
            "subtitles.Español (España)",
            "subtitles.Español (América Latina)",
            "subtitles.English",
            "subtitles.Français",
            "subtitles.Português (Portugal)",
            "subtitles.Português (Brasil)",
            "subtitles.Italiano",
            "subtitles.Deutsch",
            "subtitles.Русский",
            "subtitles.العربية",
            "subtitles.हिंदी",
            "genres",
            "editor",
            "link",
            "description",
        ]);
    })(dato);
    datos_json_expandidos.push(dato_expandido);
}
const { Parser } = require("@json2csv/plainjs");
try {
    const parser = new Parser();
    const datos_csv = parser.parse(datos_json_expandidos);
    require("fs").writeFileSync(__dirname + "/../datos/crunchyroll.com.all.csv", datos_csv, "utf8");
    console.log("OK.");
} catch (err) {
    console.error(err);
}