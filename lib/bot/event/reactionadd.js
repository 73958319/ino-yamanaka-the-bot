const reaction_add = require("../../functions/reaction_role");

exports.run = client => {
  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial) {
      await reaction.fetch();
    }
    function callback(bdd) {
      if (bdd === "not_found") return;
      let member = reaction.message.guild.members.cache.find(
        x => x.id === user.id
      );

      if (!user) return; // idk why but why not

      bdd.reaction_and_role_id.map(x => {
        for (var key in x) {
          if (x.hasOwnProperty(key)) {
            if (reaction.emoji.toString() === key) {
              let role = reaction.message.guild.roles.cache.find(role => role.id === x[key]);
              member.roles.add(role);
            }
          }
        }
      });
    }
    reaction_add.see(reaction.message.id, callback);
  });
};
