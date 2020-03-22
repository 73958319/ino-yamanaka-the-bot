const discord = require("discord.js");

exports.run = (client, msg, command) => {
  let args = msg.content.split(/ +/g).splice(1);
  let embed = new discord.MessageEmbed()
  .setColor("#ffffff")
  .setFooter("El Chadcel | X-Douli | Reflect | OGAGAL",client.user.avatarURL());
  switch(command){
    case 'userinfo':{
      let user = msg.mentions.users.first() || msg.guild.members.cache.find(x => x.id === args[0]) || msg.member;
      let plateforme = user.presence.clientStatus;
      let date_user = user.user.createdAt;
      let date = user.joinedAt;
      let roles = [];
      user.roles.cache.map(role => {
        roles.push(role.name)
      })
      embed.setTitle(`Information sur ${user.username}`)
        .setThumbnail(user.user.avatarURL())
        .addField("Id", user.id, true)
        .addField("Status", user.presence.status, true)
        .addField("Plateforme", plateforme.desktop?"Ordinateur":plateforme.web?"Web":"Mobile", true)
        .addField("Dernier message", `\`${user.lastMessage.content}\``,true)
        .addField("Date de création", `${date_user.getDay()}/${date_user.getMonth()}/${date_user.getFullYear()}`,true)
        .addField("Date de join", `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`, true)
        .addField("Rôles", roles.join(" ").replace("@everyone",""),true);
      msg.channel.send(embed)
    }
  }
}