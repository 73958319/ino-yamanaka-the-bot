const discord = require("discord.js");
let voice = new Map();

exports.run = (client, msg, command) => {
  let args = msg.content.split(/ +/g).splice(1);
  let embed = new discord.MessageEmbed()
    .setColor("#ffffff")
    .setFooter(
      "Oscuro Bot V.1",
      "https://cdn.glitch.com/d4749c9d-7c2a-4abf-8cfc-bb263c4010af%2Foscuro.png?v=1585928828175"
    );
  let dispatcher;
  switch (command) {
    case "radio": 
      let radio = args[0];
      if (!args[0])
        return msg.reply(
          "Merci de préciser une radio à écouter. Liste des radios disponibles : `skyrock`, `plaza`"
        ) && msg.react("🤮");

      async function play(url) {
        const connection = await msg.guild.channels.cache
          .find(x => x.id === msg.member.voice.channelID)
          .join();
         dispatcher = connection.play(url);
        voice.set(msg.guild.id, dispatcher)
        msg.react("👌");
      }
      switch (radio) {
        case "skyrock":
          play(
            "http://icecast.skyrock.net/s/natio_mp3_128k?tvr_name=tunein16&tvr_section1=128mp3"
          );
          break;
        case "plaza":
          play("https://radio.plaza.one/ogg");
          break;
      }
      break;
    case "leave": {
      msg.guild.channels.cache
        .find(x => x.id === msg.member.voice.channelID)
        .leave();
      msg.react("👌");
      break;
    }
    case "pause":{
      voice.get(msg.guild.id).pause();
      msg.react("👌");
      break;
    }
    case "resume":{
      voice.get(msg.guild.id).resume();
      msg.react("👌");
      break;
    }
    case "set-volume":{
      let volume = args[0];
         if (
        !volume ||
        volume <= 0 ||
        volume >= 1
      )
        return msg.channel.send("Veuillez Choisir un nombre entre 0 et 1");
      voice.get(msg.guild.id).setVolume(volume);
      msg.react("👌");
      break;
    }
  }
};
