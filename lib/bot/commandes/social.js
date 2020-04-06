const discord = require("discord.js");
const Canvas = require("canvas");
const profil = require("../../functions/profil");

exports.run = async (client, msg, command) => {
  let args = msg.content.split(/ +/g).splice(1);
  let embed = new discord.MessageEmbed()
    .setColor("#ffffff")
    .setFooter("Oscuro Bot V.1", "https://cdn.glitch.com/d4749c9d-7c2a-4abf-8cfc-bb263c4010af%2Foscuro.png?v=1585928828175");
  switch (command) {
    case "userinfo": {
      let user = msg.mentions.users.first()
        ? msg.guild.members.cache.find(
            x => x.id === msg.mentions.users.first().id
          )
        : msg.guild.members.cache.find(x => x.id === args[0])
        ? msg.guild.members.cache.find(x => x.id === args[0])
        : msg.member;
      let plateforme = user.presence.clientStatus;
      let date_user = user.user.createdAt;
      let date = user.joinedAt;
      let roles = [];
      user.roles.cache.map(role => {
        roles.push(role.name);
      });
      embed
        .setTitle(`Information sur ${user.user.username}.`)
        .setThumbnail(user.user.avatarURL())
        .addField("Id", user.id, true)
        .addField(
          "Status",
          user.presence.status === "online"
            ? "En ligne."
            : user.presence.status === "idle"
            ? "Inactif."
            : user.presence.status === "dnd"
            ? "Ne pas déranger."
            : "Hors ligne.",
          true
        )
        .addField(
          "Plateforme",
          plateforme
            ? plateforme.desktop
              ? "Ordinateur"
              : plateforme.web
              ? "Web"
              : "Mobile"
            : "Rien",
          true
        )
        .addField(
          "Dernier message",
          `\`${
            user.lastMessage
              ? user.lastMessage.content
              : "Il n'a écrit aucun message pff."
          }\``,
          true
        )
        .addField(
          "Date de création",
          `${date_user.getDay()}/${date_user.getMonth()}/${date_user.getFullYear()}`,
          true
        )
        .addField(
          "Date de join",
          `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
          true
        )
      if(!roles.join(" ").replace("@everyone", "").length < 1)
        embed.addField("Rôles", roles.join(" ").replace("@everyone", ""), true);
      msg.channel.send(embed);
      break;
    }
    case "serverinfo": {
      let serv = msg.guild;
      let date = serv.createdAt;
      embed
        .setTitle(`Information sur ${serv.name}.`)
        .setThumbnail(serv.iconURL())
        .addField("Id", serv.id, true)
        .addField("Owner", serv.owner.user.tag, true)
        .addField("Région", serv.region, true)
        .addField(
          "Date de création",
          `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
          true
        )
        .addField("Boosters", serv.premiumSubscriptionCount, true)
        .addField("Membres", serv.memberCount, true)
        .addField(
          "Bots",
          serv.members.cache.filter(x => x.user.bot === true).size,
          true
        )
        .addField(
          "Humains",
          serv.members.cache.filter(x => x.user.bot === false).size,
          true
        )
        .addField("Emojis", serv.emojis.cache.size, true)
        .addField("Rôles", serv.roles.cache.size - 1, true)
        .addField(
          "Salons textuels",
          serv.channels.cache.filter(x => x.type === "text").size,
          true
        )
        .addField(
          "Salons vocaux",
          serv.channels.cache.filter(x => x.type === "voice").size,
          true
        );
      msg.channel.send({ embed });
      break;
    }
    case "profil":
    case "rank": {
      async function callback(profil) {
        const canvas = Canvas.createCanvas(1000, 1000);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage(
          "https://plaza.one/img/backs/10.gif"
        );
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(100, 100, 800, 800);

        ctx.globalAlpha = 1;
        const avatar = await Canvas.loadImage(
          msg.author.avatarURL().replace(".webp", ".png")
        );

        ctx.drawImage(avatar, 110, 110, 200, 200);

        ctx.font = "60px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(msg.author.tag, 320, 175);

        ctx.font = "60px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(profil.niveau, 765, 802);

        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(320, 200);
        ctx.lineTo(850, 200);
        ctx.stroke();
        ctx.closePath();
        
        // thanks to https://codepen.io/Adara/pen/MYyXgg for the circle

        let options = {
          percent: ((profil.xp-profil.niveau*300)/300)*100,
          size: 165,
          lineWidth: 15,
          rotate: 0,
          color: "#ffffff"
        };

        ctx.translate(options.size / 2, options.size / 2); 
        ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); 

        let radius = (options.size - options.lineWidth) / 2;

        var drawCircle = function(color, lineWidth, percent) {
          percent = Math.min(Math.max(0, percent || 1), 1);
          ctx.beginPath();
          ctx.arc(-700, 700, radius, 0, Math.PI * 2 * percent, false);
          ctx.strokeStyle = color;
          ctx.lineCap = "square";
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        };

        drawCircle(options.color, options.lineWidth, 100 / 100);
        drawCircle("#ff00ff", options.lineWidth, options.percent / 100);

        const attachment = new discord.MessageAttachment(
          canvas.toBuffer(),
          "rank.png"
        );

        msg.channel.send(``, attachment);
      }

      profil.voir_profil(msg.author.id, callback);
    }
  }
};
