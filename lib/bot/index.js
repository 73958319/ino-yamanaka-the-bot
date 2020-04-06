const discord = require("discord.js"),
  client = new discord.Client({
    fetchAllMembers: true,
    disableMentions: "everyone"
  });

const message = require("./event/message");
const guildmember = require("./event/guildmember");

message.run(client);
guildmember.run(client);

client.on("ready", () => {
  console.log(`Connected on ${client.user.tag}.`);
  client.user.setActivity(`${client.guilds.cache.size} serveurs`, { type: 'WATCHING' })
});



client.on("guildCreate",(serv) => {
  let embed = new discord.MessageEmbed()
    .setColor("#ffffff")
    .setFooter(
      "Oscuro Bot V.1",
      "https://cdn.glitch.com/d4749c9d-7c2a-4abf-8cfc-bb263c4010af%2Foscuro.png?v=1585928828175"
    );
  client.user.setActivity(`${client.guilds.cache.size} serveurs`, { type: 'WATCHING' });
  embed.setTitle(`Merci à ${serv.name} qui vient d'ajouter le bot sur son serveur.`)
    .addField("Id :",serv.id,true)
    .addField("Nombre de membres :",serv.members.cache.size,true)
    .addField("Owner :",serv.owner.user.tag,true)
  client.channels.cache.find(x => x.id === "695917425295753236").send({embed})
})

client.on("guildDelete",(serv) => {
  let embed = new discord.MessageEmbed()
    .setColor("#ffffff")
    .setFooter(
      "Oscuro Bot V.1",
      "https://cdn.glitch.com/d4749c9d-7c2a-4abf-8cfc-bb263c4010af%2Foscuro.png?v=1585928828175"
    );
  client.user.setActivity(`${client.guilds.cache.size} serveurs`, { type: 'WATCHING' })
    embed.setTitle(`${serv.name} est un mauvais serveur.`)
    .addField("Id :",serv.id,true)
    .addField("Nombre de membres :",serv.members.cache.size,true)
    .addField("Owner :",serv.owner.user.tag,true)
  client.channels.cache.find(x => x.id === "695917425295753236").send({embed})
})

client.login(process.env.TOKEN);
