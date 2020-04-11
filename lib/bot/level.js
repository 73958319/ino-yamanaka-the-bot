const profil = require("../functions/profil");
const anti_spam = new Set();

exports.run = (id, username, msg) => {
  if (anti_spam.has(id)) return;
  anti_spam.add(id);
  setTimeout(() => {
    anti_spam.delete(id);
  }, 60 * 1000);

  function verif_profil(id) {
    profil.voir_profil(id, callback);
  }
  function callback(profil) {
    profil === "not_found"
      ? create_profil(id)
      : add_xp(id, profil.xp, profil.level);
  }

  // random number between 15 and 20
  function xp_aleatoire() {
    return Math.floor(Math.random() * (21 - 15) + 15);
  }

  function create_profil(id) {
    profil.creer_profil(id, username, xp_aleatoire(), 1, 100);
  }

  function needToLevelUp(xp, level) {
    return Math.floor(xp / 300) === level ? false : true;
  }

  function add_xp(id, xp, level) {
    let xp_to_add = xp_aleatoire();
    if (needToLevelUp(xp_to_add + xp, level))
      msg.channel.send(
        `<@!${msg.author.id}> Gg, you're up to level **${level + 1}** !`
      );
    profil.modifier_profil(id, username, "xp", xp + xp_to_add);
  }

  verif_profil(id);
};
