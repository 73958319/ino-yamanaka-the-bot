require("./lib/router/");
require("./lib/bot/");
const a = require("./lib/functions/profil");
function callback(texte){
  console.log(texte)
}
a.voir_profil(675632122765115448,callback)