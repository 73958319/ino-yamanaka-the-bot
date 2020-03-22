const discord = require("discord.js"),
      client = new discord.Client({
  fetchAllMembers: true,
  disableMentions: "all"
});

const prefix = "o?";
const colors = "#99CCFF";

const admins = ["666717640466628610", "683498004501757967", "675632122765115448"];

const level = require("./level");

const moderation = require('./commandes/moderation');
const social = require("./commandes/social");

const set_prefix = require("../functions/server");

client.on("ready", () => {
  console.log(`Connected on ${client.user.tag}.`);
});

client.on("message", async msg => {  
  level.run(msg.author.id);
  console.log(msg.content)
    
  function lancer_commandes(command, prefix) {
    console.log("dacc");
    console.log(command)
    moderation.run(client, msg, command, prefix);
    social.run(client, msg, command);
  }
  
  function callback(prefix_serv) {
    if(prefix_serv==="non_trouve"){
        if(msg.content === `<@!${client.user.id}>`) return msg.channel.send("Le préfix est `o?`.");
        let command = msg.content.split(/ +/g).shift().slice(prefix.length).toLowerCase();
      if (!msg.content.startsWith(prefix)) return;
      lancer_commandes(command, prefix);
    }
    else {
              if(msg.content === `<@!${client.user.id}>`) return msg.channel.send("Le préfix est `"+prefix_serv+"`.");
              let command = msg.content.split(/ +/g).shift().slice(prefix_serv.length).toLowerCase();
      if(!msg.content.startsWith(prefix_serv)) return;
      lancer_commandes(command, prefix_serv);
    }
  }
  
  set_prefix.see_prefix(msg.guild.id, callback)
  console.log(msg.guild.id)
});
client.login(process.env.TOKEN);
