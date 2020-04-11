const server = require("../../functions/server");

exports.run = client => {
  client.on("guildMemberAdd", membre => {
    if (membre.guild.id === "695610280582840330") {
      let channel = membre.guild.channels.cache
        .find(x => x.id === "695682145674592367")
        .setName(`Nombre de membres : ${membre.guild.members.cache.size}`);
    }
    function callback(serveur) {
      if (serveur === "not_found") return;
      if (serveur.welcome_channel === null) return;
      let channel = membre.guild.channels.cache.find(
        x => x.id === serveur.welcome_channel
      );
      if (!channel) return;
      channel.send(
        serveur.welcome_message
          .replace("{member}", `<@!${membre.id}>`)
          .replace("{guild_name}", membre.guild.name)
      );
    }
    server.see_server(membre.guild.id, callback);
  });
};
