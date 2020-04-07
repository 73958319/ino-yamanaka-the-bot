const discord = require("discord.js");

exports.run = async (client, msg, command, prefix) => {
  let args = msg.content.split(/ +/g).splice(1);
  let embed = new discord.MessageEmbed()
    .setColor("#ffffff")
    .setFooter("Oscuro Bot V.1", "https://cdn.glitch.com/d4749c9d-7c2a-4abf-8cfc-bb263c4010af%2Foscuro.png?v=1585928828175");
  switch (command) {
    case "help": {
      embed
        .setTitle("Menu help")
        .setDescription(`Le préfix du bot est \`${prefix}\`.`)
        .addField(
          "Modérations",
          "`ban`,`kick`, `voice-kick`\n`clear`, `set-prefix`",
          true
        )
        .addField("Social", "`userinfo`,`serverinfo`,\n`rank`", true)
        .addField("Information", "`links`", true)
        .addField("Economie", "`balance`, `hour`, `give [monnaie] [user]`", true)
        .addField("Fun","`say [text]`, `avatar`")
        .addField("Welcome","`set-welcome-channel [channel]`,\n`set-welcome-message [message]` (`{member}` = mention of the new member, `{guild_name}` = name of the guild)")
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
  }
};
