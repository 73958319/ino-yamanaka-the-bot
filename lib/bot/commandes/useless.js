const discord = require("discord.js");

exports.run = (client, msg, command) => {
  let embed = new discord.MessageEmbed()
  .setColor("#ffffff")
  .setFooter("Yooo man",msg.author.avatarURL());
  switch(command){
    case 'liens':
      embed
        .setTitle("Liens.")
        .addField("Dashboard","[Cliquez ici](https://bot-oscuro-5894423.glitch.me/).",true)
        .addField("Support","[Cliquez ici](https://discord.gg/X9gBUg6).",true)
        .addField("Bot", "[Cliquez ici](https://discordapp.com/oauth2/authorize?client_id=688532395225645086&scope=bot&permissions=8).",true)
        .addField("Repo github", "Soon.",true);
      msg.channel.send({embed});
      break;
  }
}