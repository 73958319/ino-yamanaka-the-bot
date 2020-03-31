const discord = require("discord.js");
const set_prefix = require("../../functions/server");

exports.run = (client, msg, command, prefix) => {
  let args = msg.content.split(/ +/g).splice(1);
  let embed = new discord.MessageEmbed()
  .setColor("#ffffff")
  .setFooter("Yooo man",msg.author.avatarURL());
  switch (command) {
    case "help": {
      embed
        .setTitle("Menu help")
        .setDescription(`Le préfix du bot est \`${prefix}\`.`)
        .addField("Modérations", "`ban`,`kick`, `voice-kick`\n`clear`, `set-prefix`",true)
        .addField("Social", "`userinfo`", true)
        .addField("Information", "`liens`",true)
        .addField("Economie", "`balance`, `hour`, `give`",true)
      msg.channel.send({ embed });
      break;
    }
    case "ban":
    case "kick":
      // déclaration
      let mentionned_user = msg.mentions.users.first();
      let victim = msg.guild.members.cache.find(x =>
        x.id === mentionned_user ? mentionned_user.id : args[0]
      );
      let reason = args.slice(1).join(" ");

      // conditions
      if (!victim)
        return msg.channel.send("Je ne peux pas identifier cet utilisateur.");
      if (!reason) return msg.reply("Veuillez indiquer une raison.");
      if (!msg.member.hasPermission(8))
        return msg.channel.send("Tu n'es pas moderateur!");
      if (victim.hasPermission(8))
        return msg.channel.send("Tu ne peux pas ban un moderateur!");

      // préparation du message
      embed
        .setTitle("Ban Log")
        .addField("Banned User", `${victim}`)
        .addField("Banned By", `<@${msg.author.id}>`)
        .addField("Time", msg.createdAt)
        .addField("Reason et Ban ID", reason);

      // action
      if (command === "ban") {
        victim.ban(reason);
      }
      if (command === "kick") {
        victim.kick(reason);
      }

      // envoie
      msg.channel.send(embed);

      break;
    case "voice-kick":
      // déclarations
      let user = msg.mentions.users.first();
      if (!user) {
        return msg.edit("Veuillez mentionner un utilisateur!");
      }
      let kickMention = msg.guild.members.get(user.id);
      if (kickMention) {
        if (!kickMention.voiceChannel) {
          msg.channel.sendMessage(
            `**${user.username}** n'est pas dans un channel vocal.`
          );
        } else {
          msg.guild
            .createChannel(`kick`, `voice`)
            .then(channel => {
              setTimeout(() => {
                kickMention.setVoiceChannel(channel);
              }, 1000);
              setTimeout(() => {
                msg.edit(`J'ai kick **${user.username}** du channel vocal.`);
                channel.delete();
              }, 1500);
            })
            .catch(error => {
              msg.channel.sendMessage(
                `Je ne peux pas kick **${user.username}** du channel vocal.`
              );
            });
        }
      }
      break;
    case "clear":
      // déclaration
      const nombre_de_message = parseInt(args[0], 10);

      // conditions
      if (!msg.member.hasPermission("MANAGE_MESSAGES"))
        return msg.channel.send(
          "Tu n'as pas la permission d'utiliser cette commande!"
        );
      if (
        !nombre_de_message ||
        nombre_de_message < 2 ||
        nombre_de_message > 100
      )
        return msg.channel.send("Choisis un nombre entre 2 et 100");

      // action
      msg.channel.messages
        .fetch({ limit: nombre_de_message })
        .then(messages => {
          console.log(messages);
          msg.channel.bulkDelete(messages).then(() => {
            msg.channel.send("Supression réussite.");
          });
        });
      break;
    case 'set-prefix':{
      let prefix_arg = args[0];
      if (!msg.member.hasPermission(8))
        return msg.channel.send("Tu n'es pas moderateur!");
      if (!prefix)
        return msg.channel.send("Pas de préfix renseigné.");
      
      set_prefix.set_prefix(msg.guild.id,prefix_arg);
      
      msg.channel.send(`Le préfix du bot sur le serveur a bien été changé à \`${prefix_arg}\``)
    }
  }
};
