const discord = require("discord.js");
let voice = new Map();

exports.run = (client, msg, command, embed) => {
  let args = msg.content.split(/ +/g).splice(1);
  let dispatcher;
  switch (command) {
    case "radio": 
      let radio = args[0];
      if (!args[0])
        return msg.reply(
          "Thanks to precise a radio. List of radios availables : `skyrock`, `plaza`"
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
        return msg.channel.send("Please choose a number between 0");
      voice.get(msg.guild.id).setVolume(volume);
      msg.react("👌");
      break;
    }
  }
};
