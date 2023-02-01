const shuffleArray = function (array_original) {
    const array = [].concat(array_original);
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
const all_manga_original = require(__dirname + "/all_manga.original.json");
const all_manga_original_shuffled = shuffleArray(all_manga_original);
require("fs").writeFileSync(__dirname + "/all_manga.json", JSON.stringify(all_manga_original_shuffled), "utf8");