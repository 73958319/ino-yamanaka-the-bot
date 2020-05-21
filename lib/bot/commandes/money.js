const discord = require("discord.js");
const money = require("../../functions/profil");

const hour = new Map();

exports.run = (client, msg, command, embed,prefix) => {
  let args = msg.content.split(/ +/g).splice(1);
  switch (command) {
    case "bal":
    case "balance": {
      let user = msg.mentions.users.first()
        ? msg.mentions.users.first()
        : msg.author;

      function callback(profil) {
        embed
          .setTitle(`Balance of **${user.tag}**.`)
          .setDescription(`${user.username} has **${profil.money}$**.`);
        msg.channel.send({ embed });
      }

      money.voir_profil(user.id, callback);
      break;
    }
    case "give":
      let user = msg.mentions.users.first();
      if (!user) return msg.reply("Thanks to provide a member to gives to.");
      if (user === msg.author)
        return msg.reply("You can't give to yourself.");
      let montant = args[0];
      if (!args[1]) return `${prefix}give [money] [user]`;
      console.log(montant);
      console.log("!!!");

      if (!montant) return msg.reply("Thanks to provide the amount.");
      if (isNaN(parseInt(montant)) || parseInt(montant) < 0) 
        return msg.reply(`${prefix}give [money] [user]`);
      if (!Math.sign(montant) === 1)
        return msg.reply(`${prefix}give [money] [user]`);

      function callback_author(profil) {
        if (profil.money < montant)
          return msg.reply("You dont the money required.");
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
        msg.reply("Done !");
      }

      money.voir_profil(msg.author.id, callback_author);

      break;
    case "hour":
      console.log(new Date().getMinutes());
      if (hour.has(msg.author.id)) {
        let date = Math.abs(new Date() - hour.get(msg.author.id));
        let minutes_secondes = +60 - date / (1000 * 60);
        return msg.reply(
          "Thanks to wait " +
            minutes_secondes.toString().substring(0, 5) +
            " minutes."
        );
      }
      hour.set(msg.author.id, new Date());
      setTimeout(() => {
        hour.delete(msg.author.id);
      }, 60 * 60 * 1000);
      function callback(profil) {
        let money_to_add = Math.floor(Math.random() * (101 - 50) + 50);
        money.modifier_profil(
          msg.author.id,
          null,
          "money",
          profil.money + money_to_add
        );
        msg.reply("You have been receiving " + money_to_add + "$.");
      }
      money.voir_profil(msg.author.id, callback);
      break;
  }
};
