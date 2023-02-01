/*
////////////////////////////
//
// [*] Para extraer:
//
console.log(localStorage.getItem("crunchyroll.especifico.profundo"))
//
////////////////////////////
//
// [*] Para borrar:
//
localStorage.setItem("crunchyroll.especifico.profundo", "{}")
// 
////////////////////////////
*/

const file_src = __dirname + "/../datos/datos.str.json";
const data_src = require(file_src);
const file_dst = __dirname + "/../datos/datos.acc.json";
const file_dst_bkp = __dirname + "/../datos/datos.acc.bkp.json";
const data_dst = require(file_dst);
const data_dst_2 = Object.assign(data_dst, data_src);
require("fs").writeFileSync(file_dst, JSON.stringify(data_dst_2, null, 2), "utf8");
require("fs").writeFileSync(file_dst_bkp, JSON.stringify(data_dst_2, null, 2), "utf8");