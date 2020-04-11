const level = require("../level");

const moderation = require("../commandes/moderation");
const social = require("../commandes/social");
const useless = require("../commandes/useless");
const money = require("../commandes/money");
const config = require("../commandes/config");
const voice = require("../commandes/voice");

const set_prefix = require("../../functions/server");

const config_json = require("../../../config.json");

const prefix = config_json.prefix;
const color = config_json.embed_color;

const discord = require("discord.js");

exports.run = client => {
  client.on("message", msg => {
    let embed = new discord.MessageEmbed()
      .setColor(color)
      .setFooter(client.user.tag, client.user.avatarURL());
    if (msg.author.bot) return;
    level.run(msg.author.id, msg.author.tag, msg);

    function lancer_commandes(command, prefix) {
      moderation.run(client, msg, command, prefix, embed);
      social.run(client, msg, command, embed);
      useless.run(client, msg, command, embed);
      money.run(client, msg, command, embed,prefix);
      config.run(client, msg, command, embed);
      voice.run(client, msg, command, embed);
    }
    function callback(prefix_serv) {
      if (prefix_serv === "not_found") {
        if (msg.content === `<@!${client.user.id}>`)
          return msg.channel.send("The prefix of the bot is `" + prefix + "`.");
        let command = msg.content
          .split(/ +/g)
          .shift()
          .slice(prefix.length)
          .toLowerCase();
        if (!msg.content.startsWith(prefix)) return;
        lancer_commandes(command, prefix);
      } else {
        if (msg.content === `<@!${client.user.id}>`)
          return msg.channel.send(
            "The prefix of the bot is `" + prefix_serv.prefix + "`."
          );
        let command = msg.content
          .split(/ +/g)
          .shift()
          .slice(prefix_serv.prefix.length)
          .toLowerCase();
        if (!msg.content.startsWith(prefix_serv.prefix)) return;
        lancer_commandes(command, prefix_serv.prefix);
      }
    }

    set_prefix.see_server(msg.guild.id, callback);
  });
};
