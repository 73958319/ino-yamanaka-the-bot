const discord = require("discord.js");
const warn = require("../../functions/warn");

exports.run = async (client, msg, command, prefix, embed) => {
  let args = msg.content.split(/ +/g).splice(1);
  switch (command) {
    case "help": {
      embed
        .setTitle("Pannel help")
        .setDescription(`The prefix of the bot is \`${prefix}\`.`)
        .addField(
          "Moderation",
          "`ban`,`kick`, `voice-kick`\n`clear`, `set-prefix`, `set-reaction-role [message_id], [emoji], [role]`\n`warn [user] [reason]`\n`see-warn [user]`",
          true
        )
        .addField("Social", "`userinfo`,`serverinfo`,\n`rank`", true)
        .addField("Information", "`links`", true)
        .addField(
          "Economie",
          "`balance`, `hour`, `give [monnaie] [user]`",
          true
        )
        .addField("Fun", "`say [text]`, `avatar`\n`sondage`, `botinfo`",true)
        .addField(
          "Welcome",
          "`set-welcome-channel [channel]`,\n`set-welcome-message [message]` (`{member}` = mention of the new member, `{guild_name}` = name of the guild)",
        true
        );
      msg.channel.send({ embed });
      break;
    }
    case "ban":
    case "kick": {
      let mentionned_user_y = msg.mentions.users.first();
      let id_xy =
        mentionned_user_y !== undefined ? mentionned_user_y.id : args[0];
      let victim = msg.guild.members.cache.find(x => x.id === id_xy);
      
      let reason = args.slice(1).join(" ");

      // conditions
      if (!msg.member.hasPermission("KICK_MEMBERS"))
        return msg.reply("You are not admin.");
      if (!args[0] || !victim) return msg.reply("Please provide a valid member.");
      if (victim.hasPermission("KICK_MEMBERS"))
        return msg.reply("You can't ban an admin.");
      if (!msg.guild.member(victim).bannable) return msg.reply('The bot doesn\'t have permission.');
      if (!reason) return msg.reply("Please indicate a reason.");

      let date_user = msg.createdAt;
      
      // préparation du message
      embed
        .setTitle("Ban Log")
        .addField("Banned User", `${victim}`)
        .addField("Banned By", `<@${msg.author.id}>`)
        .addField("Time", `${date_user.getDay()}/${date_user.getMonth()}/${date_user.getFullYear()}`)
        .addField("Reason et Ban ID", reason);

      // action
      if (command === "ban") {
        victim.ban(reason).then(() => {msg.channel.send(embed);}).catch(() => {
       return msg.reply("I can't.");
    });
      }
      if (command === "kick") {
        victim.kick(reason).then(() => {msg.channel.send(embed);}).catch(() => {
       return msg.reply("I can't.");
    });
      }
      break;
    }
    case "voice-kick": {
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
    }
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
          }).catch(() => {msg.channel.send("I can't.")});
        });
      break;
    case "warn": {
      // déclaration
      let mentionned_user_y = msg.mentions.users.first();
      let id_xy =
        mentionned_user_y !== undefined ? mentionned_user_y.id : args[0];
      let victim_y = msg.guild.members.cache.find(x => x.id === id_xy);
      let reason = args.slice(1).join(" ");

      // conditions
      if (!victim_y) return msg.channel.send("I can't find this user.");
      if (!reason) return msg.reply("Please indicate a reason.");
      if (!msg.member.hasPermission("KICK_MEMBERS"))
        return msg.channel.send("You are not admin.");
      if (victim_y.hasPermission("KICK_MEMBERS")) {
        return msg.channel.send("You can't warn an admin.");
      }

      warn.create(msg.guild.id, victim_y.id, msg.author.id, reason);

      msg.channel.send("Done !");
      break;
    }
    case "see-warn": {
      // déclaration
      let mentionned_user_y = msg.mentions.users.first();
      let id_xy =
        mentionned_user_y !== undefined ? mentionned_user_y.id : args[0];
      let victim_y = msg.guild.members.cache.find(x => x.id === id_xy);

      function callback(doc) {
        var list_warns = [];
        if (doc.length < 1)
          return msg.channel.send("This user has no warn.");
        doc.map((warn_x, i) => {
          list_warns.push(
            `${i}. **${warn_x.reason}**\n- Asked by **${warn_x.executioner_id}**.`
          );
        });
        embed.setTitle(`Liste des warns de ${victim_y.user.tag}.`);
        embed.setDescription(list_warns.join("\n"));
        msg.channel.send(embed);
      }

      warn.see(msg.guild.id, victim_y.id, callback);
      break;
    }
    case "sondage": {
      if (!msg.member.hasPermission("KICK_MEMBERS"))
        return msg.channel.send("You are not admin.");
      let text = args.join(" ").split(":");
      if(!text[0] || !text[1])
        return msg.channel.send("Thanks to indicate a title and the description (separed by `:`).")
      embed.setTitle(text[0])
        .setDescription(text[1]);
      
      msg.channel.send({embed}).then(message => message.react("701143770556792903") && message.react("701145837727645840"));
      break;
    }
    case "eval": {
        const clean = text => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };
  
      
      const ids_author = ["327074335238127616", "675632122765115448"]
    if (!ids_author.includes(msg.author.id)) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      msg.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      msg.channel.send(`\`ERREUR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
    }
  }
};
