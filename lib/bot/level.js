const profil = require("../functions/profil");
const anti_spam = new Set();

exports.run = (id, username, msg) => {
  if (anti_spam.has(id)) return;
  anti_spam.add(id);
  setTimeout(() => {
    anti_spam.delete(id);
  }, 60 * 1000);

  function verifier_profil(id) {
    profil.voir_profil(id, verifier_profil_callback);
  }
  function verifier_profil_callback(profil) {
    profil === "non_trouve" ? creer_profil(id) : add_xp(id, profil.xp, profil.niveau);
  }

  // nombre aléatoire entre 15 et 20
  function xp_aleatoire() {
    return Math.floor(Math.random() * (21 - 15) + 15);
  }

  function creer_profil(id) {
    profil.creer_profil(id, username, xp_aleatoire(), 1, 100);
  }

function doitAugmenterEnNiveau(xp,niveau) {
  return Math.floor(xp/300)===niveau?false:true;
}
  
  function add_xp(id, xp, niveau) {
    let xp_a_ajouter = xp_aleatoire()
    if(doitAugmenterEnNiveau(xp_a_ajouter+xp, niveau)) msg.channel.send(`<@!${msg.author.id}> Gg, tu viens de passer niveau **${niveau+1}**.`);
    profil.modifier_profil(id, username, "xp",xp+ xp_a_ajouter);
  }


  verifier_profil(id);
};
