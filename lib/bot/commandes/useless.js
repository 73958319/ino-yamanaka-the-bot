const discord = require("discord.js"),
      request = require("superagent");

exports.run = (client, msg, command) => {
  let args = msg.content.split(/ +/g).splice(1);
  let embed = new discord.MessageEmbed()
  .setColor("#ffffff")
    .setFooter("Oscuro Bot V.1", "https://cdn.glitch.com/d4749c9d-7c2a-4abf-8cfc-bb263c4010af%2Foscuro.png?v=1585928828175");
  switch(command){
    case 'liens':{
      embed
        .setTitle("Liens.")
        .addField("Dashboard","[Cliquez ici](http://www.oscuro.gq/).",true)
        .addField("Support","[Cliquez ici](https://discord.gg/uPayF5X).",true)
        .addField("Bot", "[Cliquez ici](https://discordapp.com/oauth2/authorize?client_id=688531490283192431&scope=bot&permissions=8).",true)
        .addField("Repo github", "Soon.",true);
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
            embed.setTitle(`Avatar de ${user.tag}.`)
        .setImage(image)
        .setDescription(`[Url](${image}).`)
      msg.channel.send({embed})
   })
   .catch(err => {
            embed.setTitle(`Avatar de ${user.tag}.`)
        .setImage(user.avatarURL())
        .setDescription(`[Url](${user.avatarURL()}).`)
      msg.channel.send({embed})
   });
      
      break;
    }
  }
}