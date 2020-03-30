const discord = require("discord.js");
const money = require("../../functions/profil");

const hour = new Set();

exports.run = (client, msg, command) => {
  let args = msg.content.split(/ +/g).splice(1);
  let embed = new discord.MessageEmbed()
    .setColor("#ffffff")
    .setFooter("Yooo man", msg.author.avatarURL());
  switch (command) {
    case "bal":
    case "balance": {
      let user = msg.mentions.users.first()
        ? msg.mentions.users.first()
        : msg.author;

      function callback(profil) {
        embed
          .setTitle(`Balance de **${user.tag}**.`)
          .setDescription(`Cet utilisateur dispose de **${profil.money}$**.`);
        msg.channel.send({ embed });
      }

      money.voir_profil(user.id, callback);
      break;
    }
    case "give":
      let user = msg.mentions.users.first();
      if (!user) return msg.reply("Merci de préciser un membre à qui donner.");
      let montant = args[0];
      console.log(montant);
      console.log("!!!");

      if (!montant) return msg.reply("Merci d'indiquer le montant.");
      if (Number.isInteger(montant))
        return msg.reply("Merci d'indiquer un nombre valide.");
      if (!Math.sign(montant) === 1)
        return msg.reply("Merci d'entrer un nombre positif.");

      function callback_author(profil) {
        if (profil.money < montant)
          return msg.reply("Vous n'avez pas l'argent requis.");
        money.modifier_profil(
          msg.author.id,
          null,
          "money",
          profil.money - montant
        );
        function callback_victim(profil) {
          money.modifier_profil(
            user.id,
            null,
            "money",
            parseInt(profil.money) + parseInt(montant)
          );
        }

        money.voir_profil(user.id, callback_victim);
        msg.reply("Vous avez bien donné.");
      }

      money.voir_profil(msg.author.id, callback_author);

      break;
    case "hour":
      if (hour.has(msg.author.id))
        return msg.reply("Merci d'attendre une heure.");
      hour.add(msg.author.id);
      setTimeout(() => {
        hour.delete(msg.author.id);
      }, 60 * 60 * 1000);
      function callback(profil) {
        money.modifier_profil(msg.author.id, null, "money", profil.money + Math.floor(Math.random() * (101 - 50) + 50));
        msg.reply("Vous avez bien reçu votre récompense.")
      }
      money.voir_profil(msg.author.id, callback);
      break;
  }
};
