const discord = require("discord.js"),
  client = new discord.Client({
    fetchAllMembers: true,
    disableMentions: "everyone",
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
  });

const message = require("./event/message");
const guildmember = require("./event/guildmember");
const reactionadd = require("./event/reactionadd");

const stats = require("../functions/stats.js");

message.run(client);
guildmember.run(client);
reactionadd.run(client);

function set_activity() {
  let plurial = client.guilds.cache.size > 1 ? "s" : "";
  client.user.setActivity(`${client.guilds.cache.size} guild${plurial}.`, {
    type: "WATCHING"
  });
}

client.on("ready", () => {
  console.log(`Connected on ${client.user.tag}.`);
  set_activity();
  stats.create(client.guilds.cache.size, client.users.cache.size);
  function callback(objet) {
    console.log(objet);
  }
  stats.see(callback);
});

client.on("guildCreate", serv => {
  stats.create(client.guilds.cache.size, client.users.cache.size);
  set_activity();
});

client.on("guildDelete", serv => {
  stats.create(client.guilds.cache.size, client.users.cache.size);
  set_activity();
});

client.login(process.env.TOKEN);
