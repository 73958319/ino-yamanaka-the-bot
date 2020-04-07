const level = require("../level");

const prefix = "o?";
const colors = "#99CCFF";

const moderation = require("../commandes/moderation");
const social = require("../commandes/social");
const useless = require("../commandes/useless");
const money = require("../commandes/money");
const config = require("../commandes/config");
const voice = require("../commandes/voice");

const set_prefix = require("../../functions/server");

exports.run = (client) => {
  client.on("message", async msg => {
  if (msg.author.bot) return;
  level.run(msg.author.id, msg.author.tag, msg);

  function lancer_commandes(command, prefix) {
    moderation.run(client, msg, command, prefix);
    social.run(client, msg, command);
    useless.run(client, msg, command);
    money.run(client, msg, command);
    config.run(client, msg, command);
    voice.run(client, msg, command)
  }
  function callback(prefix_serv) {
    if (prefix_serv === "not_found") {
      if (msg.content === `<@!${client.user.id}>`)
        return msg.channel.send("Le préfix est `o?`.");
      let command = msg.content
        .split(/ +/g)
        .shift()
        .slice(prefix.length)
        .toLowerCase();
      if (!msg.content.startsWith(prefix)) return;
      lancer_commandes(command, prefix);
    } else {
      if (msg.content === `<@!${client.user.id}>`)
        return msg.channel.send("Le préfix est `" + prefix_serv.prefix + "`.");
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
}