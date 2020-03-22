const profil = require("../functions/profil");
const anti_spam = new Set();

exports.run = id => {
    if (anti_spam.has(id)) return;
  anti_spam.add(id);
  setTimeout(() => {
    anti_spam.delete(id);
  }, 60 * 1000);
  
  function verifier_profil(id) {
    profil.voir_profil(id, verifier_profil_callback);
  }
  function verifier_profil_callback(profil) {
    profil === "non_trouve" ? creer_profil(id) : add_xp(id, profil.xp);
  }

  // nombre aléatoire entre 15 et 20
  function xp_aleatoire() {
    return Math.floor(Math.random() * (21 - 15) + 15);
  }

  function creer_profil(id) {
    profil.creer_profil(id, xp_aleatoire(), 1, 100);
  }

  function add_xp(id, xp) {
    profil.modifier_profil(id, "xp", xp + xp_aleatoire());
    console.log(xp);
  }
  
  console.log(id)

  verifier_profil(id);
};
