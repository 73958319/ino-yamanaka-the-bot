const discord = require("discord.js");
const server = require("../../functions/server");
const reaction_role = require("../../functions/reaction_role");

exports.run = (client, msg, command, prefix, embed) => {
  let args = msg.content.split(/ +/g).splice(1);
  switch (command) {
    case "set-prefix": {
      if (!msg.member.hasPermission(8))
        return msg.channel.send("You don't have permission.");
      let prefix_arg = args[0];
      if (!prefix_arg) return msg.channel.send("Thanks to provide a prefix.");

      server.set_prefix(msg.guild.id, prefix_arg);

      msg.channel.send("Done !");
      break;
    }
    case "set-welcome-channel": {
      if (!msg.member.hasPermission(8))
        return msg.channel.send("You don't have permission.");
      let channel = msg.mentions.channels.first();
      if (!channel) return msg.reply("Thanks to precise the channel.");
      if(channel.permissionsFor(client.user).has("SEND_MESSAGES") === false){
        return msg.channel.send("The bot doesn't have permission to send message in this channel.");
      }
      server.set_welcome_channel(msg.guild.id, channel.id);
      msg.channel.send("Done !");
      break;
    }
    case "set-welcome-message": {
      if (!msg.member.hasPermission(8))
        return msg.channel.send("You don't have permission.");
      let message = args.join(" ");
      if (message.length < 10)
        return msg.reply("Thanks to set a minimum of 10 characters.");
      server.set_welcome_message(msg.guild.id, message);
      msg.channel.send("Done !");
      break;
    }
    case "set-reaction-role": {
      if (!msg.member.hasPermission(8))
        return msg.channel.send("You don't have permission.");
      
      let message_id = args[0];
      let emoji = args[1];
      let role = args[2];
      
      if(!message_id || !emoji || !role)
        return msg.channel.send("An element is missed. [message_id], [emoji], [role]")
      
      let verif_role = msg.guild.roles.cache.find(x => x.id === role);
      
      if(!verif_role)
        return msg.channel.send("Give the role ID pls ...")
      
      reaction_role.create(message_id,emoji,role)
      
      msg.channel.send("Done !");
      break;
    }
  }
};
