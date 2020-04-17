const discord = require("discord.js");

exports.run = async (client, msg, command, prefix, embed) => {
  let args = msg.content.split(/ +/g).splice(1);
  switch (command) {
    case "help": {
      embed
        .setTitle("Pannel help")
        .setDescription(`The prefix of the bot is \`${prefix}\`.`)
        .addField(
          "Moderation",
          "`ban`,`kick`, `voice-kick`\n`clear`, `set-prefix`, `set-reaction-role [message_id], [emoji], [role]`",
          true
        )
        .addField("Social", "`userinfo`,`serverinfo`,\n`rank`", true)
        .addField("Information", "`links`", true)
        .addField(
          "Economie",
          "`balance`, `hour`, `give [monnaie] [user]`",
          true
        )
        .addField("Fun", "`say [text]`, `avatar`")
        .addField(
          "Welcome",
          "`set-welcome-channel [channel]`,\n`set-welcome-message [message]` (`{member}` = mention of the new member, `{guild_name}` = name of the guild)"
        );
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
      if (!victim) return msg.channel.send("I can't find this user.");
      if (!reason) return msg.reply("Please indicate a reason.");
      if (!msg.member.hasPermission(8))
        return msg.channel.send("You are not admin.");
      if (victim.hasPermission(8))
        return msg.channel.send("You can't ban an admin.");

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
        return msg.edit("Please mention a member.");
      }
      let kickMention = msg.guild.members.get(user.id);
      if (kickMention) {
        if (!kickMention.voiceChannel) {
          msg.channel.sendMessage(
            `**${user.username}** isn't in a voice chat..`
          );
        } else {
          msg.guild
            .createChannel(`kick`, `voice`)
            .then(channel => {
              setTimeout(() => {
                kickMention.setVoiceChannel(channel);
              }, 1000);
              setTimeout(() => {
                msg.edit(`I kicked **${user.username}** of the voice chat.`);
                channel.delete();
              }, 1500);
            })
            .catch(error => {
              msg.channel.sendMessage(`I can't kick **${user.username}**.`);
            });
        }
      }
      break;
    case "clear":
      // déclaration
      const amount_of_message = parseInt(args[0], 10);

      // conditions
      if (!msg.member.hasPermission("MANAGE_MESSAGES"))
        return msg.channel.send("You dont have permission.");
      if (
        !amount_of_message ||
        amount_of_message < 2 ||
        amount_of_message > 100
      )
        return msg.channel.send("Choose a number between 2 and 100.");

      // action
      msg.channel.messages
        .fetch({ limit: amount_of_message })
        .then(messages => {
          msg.channel.bulkDelete(messages).then(() => {
            msg.channel.send("Successfully removed.").then(message => {
              message.delete({ timeout: 2000 });
            });
          });
        });
      break;
  }
};
