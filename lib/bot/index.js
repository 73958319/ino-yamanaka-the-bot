const discord = require("discord.js"),
  client = new discord.Client({
    fetchAllMembers: true,
    disableMentions: "everyone"
  });

const message = require("./event/message");
const guildmember = require("./event/guildmember");

message.run(client);
guildmember.run(client);

function set_activity() {
  let plurial = client.guilds.cache.size > 1 ? "s" : "";
  client.user.setActivity(`${client.guilds.cache.size} guild${plurial}.`, {
    type: "WATCHING"
  });
}

client.on("ready", () => {
  console.log(`Connected on ${client.user.tag}.`);
  set_activity();
});

client.on("guildCreate", serv => {
  set_activity();
});

client.on("guildDelete", serv => {
  set_activity();
});

client.login(process.env.TOKEN);
