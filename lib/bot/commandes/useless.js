const discord = require("discord.js"),
      request = require("superagent");

exports.run = (client, msg, command, embed) => {
  let args = msg.content.split(/ +/g).splice(1);
  switch(command){
    case 'links':{
      embed
        .setTitle("Links.")
        .addField("Dashboard","[Link]("+process.env.redirectURL+").",true)
        .addField("Bot", "[Link](https://discordapp.com/oauth2/authorize?client_id="+process.env.CLIENT_ID+"&scope=bot&permissions=8).",true)
        .addField("Repo github", "[Link](https://github.com/Aaaaalpha/bot-discord-web-dashboard).",true);
      msg.channel.send({embed});
      break;
    }
    case 'say':{
      msg.delete();
      embed.setDescription(args.join(" "))
      msg.channel.send({embed})
      break;
    }
    case 'pp':
    case 'avatar':{
            let member = msg.mentions.users.first()
        ? msg.guild.members.cache.find(
            x => x.id === msg.mentions.users.first().id
          )
        : msg.guild.members.cache.find(x => x.id === args[0])
        ? msg.guild.members.cache.find(x => x.id === args[0])
        : msg.member;
      let user = member.user;
      
      let image = user.avatarURL().replace(".webp",".gif")
      
       request
   .get(image)
   .then(res => {
            embed.setTitle(`Avatar of ${user.tag}.`)
        .setImage(image)
        .setDescription(`[Url](${image}).`)
      msg.channel.send({embed})
   })
   .catch(err => {
            embed.setTitle(`Avatar of ${user.tag}.`)
        .setImage(user.avatarURL())
        .setDescription(`[Url](${user.avatarURL()}).`)
      msg.channel.send({embed})
   });
      
      break;
    }
  }
}