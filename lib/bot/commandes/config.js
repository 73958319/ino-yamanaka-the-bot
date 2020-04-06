const discord = require("discord.js");
const server = require("../../functions/server");

exports.run = (client, msg, command, prefix) => {
  let args = msg.content.split(/ +/g).splice(1);
  let embed = new discord.MessageEmbed()
    .setColor("#ffffff")
    .setFooter("Oscuro Bot V.1", "https://cdn.glitch.com/d4749c9d-7c2a-4abf-8cfc-bb263c4010af%2Foscuro.png?v=1585928828175");
 
  switch (command) {
    case "set-prefix": {
       if (!msg.member.hasPermission(8))
    return msg.channel.send("Tu n'es pas moderateur!");
      let prefix_arg = args[0];
      if (!msg.member.hasPermission(8))
        return msg.channel.send("Tu n'es pas moderateur!");
      if (!prefix_arg) return msg.channel.send("Pas de préfix renseigné.");

      server.set_prefix(msg.guild.id, prefix_arg);

      msg.channel.send(
        `Le préfix du bot sur le serveur a bien été changé à \`${prefix_arg}\``
      );
      break;
    }
    case "set-welcome-channel": {
       if (!msg.member.hasPermission(8))
    return msg.channel.send("Tu n'es pas moderateur!");
      let channel = msg.mentions.channels.first();
      if(!channel) return msg.reply("Veuillez préciser le channel en le mentionnant.");
      server.set_welcome_channel(msg.guild.id, channel.id);
      msg.channel.send("Le salon de bienvenue a bien été mis à jour.")
      break;
    }
    case "set-welcome-message":{
       if (!msg.member.hasPermission(8))
    return msg.channel.send("Tu n'es pas moderateur!");
      let message = args.join(" ");
      if(message.length < 10) return msg.reply("Veuillez insérer au moins 10 caractères dans le message.");
      server.set_welcome_message(msg.guild.id,message);
      msg.channel.send("Le message de bienvenue a bien été mis à jour.");
      break;
    }
  }
};
