const btoa = require("btoa");
const fetch = require("node-fetch");
const url = require("url");
const redirect = encodeURIComponent(process.env.redirectURL + "callback");
const express = require("express"),
  Discord = require("discord.js"),
  router = express.Router();

const profil = require("../functions/profil");
const server = require("../functions/server");

const CLIENT_ID = process.env.CLIENT_ID,
  CLIENT_SECRET = process.env.CLIENT_SECRET;

const config = require("../../config.json");

router.get("/", function(req, res) {
  if (req.session.username) {
    res.render("login", {
      bot_id: process.env.CLIENT_ID,
      profil: {
        profil: {
          username: req.session.username
        }
      },
      app_name: config.app_name,
      app_description: config.app_description
    });
  } else {
    res.render("login", {
      bot_id: process.env.CLIENT_ID,
      profil: undefined,
      app_name: config.app_name,
      app_description: config.app_description
    });
  }
});

router.get("/invite", function(req, res) {
  res.redirect(
    "https://discordapp.com/oauth2/authorize?client_id=" +
      process.env.CLIENT_ID +
      "&scope=bot&permissions=8"
  );
});

router.get("/home", (req, res) => {
  if (!req.session.username) return res.redirect("/");
  function callback(profil) {
    if (profil === "not_found") {
      res.render("member/home", {
        profil: {
          username: req.session.username,
          id: req.session.id_user,
          avatar: req.session.avatar,
          xp: 0,
          money: 0,
          reputation: 0,
          level: 0
        },
        app_name: config.app_name
      });
    }
    if (profil !== "not_found") {
      res.render("member/home", {
        profil: {
          username: req.session.username,
          id: req.session.id_user,
          avatar: req.session.avatar,
          xp: profil.xp,
          money: profil.money,
          reputation: profil.reputation,
          level: profil.level
        },
        app_name: config.app_name
      });
    }
  }
  profil.voir_profil(req.session.id_user, callback);
});

router.get("/login_redirect", (req, res) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20guilds&response_type=code&redirect_uri=${redirect}`
  );
});

router.get("/callback", (req, res) => {
  let code = req.query.code;
  if (!code) throw new Error("NoCodeProvided");
  const creds = new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");
  fetch(
    `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}&scope=identify`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`
      }
    }
  )
    .then(res => res.json())
    .then(response => {
      req.session.access_token = response.access_token;
      fetch("https://discordapp.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${response.access_token}`
        }
      })
        .then(res => res.json())
        .then(response => {
          req.session.username = `${response.username}#${response.discriminator}`;
          req.session.id_user = response.id;
          req.session.avatar = response.avatar;
          res.redirect("./home");
        });
    })
    .catch(console.error);
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
//invite sur un serv avec le bot steuplait - reflect

router.get("/guilds", (req, res) => {
  if (!req.session.username) return res.redirect("/");
  fetch("https://discordapp.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${req.session.access_token}`
    }
  })
    .then(resp => resp.json())
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        let isAdmin = new Discord.Permissions(data[i].permissions).any(8);
        if (isAdmin === false) {
          delete data[i];
        }
      }
      res.render("./member/guild_list", {
        guilds: data,
        profil: {
          username: req.session.username,
          id: req.session.id_user,
          avatar: req.session.avatar
        },
        app_name: config.app_name
      });
    });
});

router.get("/guilds/:id", (req, res) => {
  if (!req.session.username) return res.redirect("/");
  const id = req.params.id;
  function isAdmin() {
    fetch("https://discordapp.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${req.session.access_token}`
      }
    })
      .then(resp => resp.json())
      .then(data => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id === id) {
            console.log(data[i]);
            let isAdmin = new Discord.Permissions(data[i].permissions).any(8);
            if (isAdmin === false) return res.redirect("/guilds");

            var guild = data[i];
            console.log(
              "https://discordapp.com/api/guilds/" + guild.id + "/channels"
            );
            fetch(
              "https://discordapp.com/api/guilds/" + guild.id + "/channels",
              {
                headers: {
                  Authorization: `Bot ${process.env.TOKEN}`
                }
              }
            )
              .then(respa => respa.json())
              .then(channels => {
                console.log(channels);
                function callback(doc) {
                  function send(prefix_guild) {
                    console.log(channels);
                    res.render("./member/guild_dashboard", {
                      server: {
                        name: guild.name,
                        prefix: prefix_guild,
                        channels: channels
                      },
                      profil: {
                        username: req.session.username,
                        id: req.session.id_user,
                        avatar: req.session.avatar
                      },
                      app_name: config.app_name
                    });
                  }

                  if (doc === "not_found") {
                    send("i/");
                  }
                  if (doc !== "not_found") {
                    send(doc.prefix);
                  }
                }
                server.see_server(guild.id, callback);
              });
          }
        }
      });
  }
  fetch("https://discordapp.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`
    }
  })
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
      let condition = false;
      data.map(guild => {
        if (guild.id === id) {
          condition = true;
        }
      });
      if (condition === false)
        return res.redirect(
          "https://discordapp.com/oauth2/authorize?client_id=" +
            process.env.CLIENT_ID +
            "&scope=bot&permissions=8"
        );
      if (condition === true) return isAdmin();
    });
});

router.get("/leaderboard", (req, res) => {
  function callback(leaderboard) {
    if (!req.session.username) {
      res.render("./member/leaderboard", {
        leaderboard: leaderboard,
        profil: undefined,
        app_name: config.app_name
      });
    } else {
      res.render("./member/leaderboard", {
        leaderboard: leaderboard,
        profil: {
          username: req.session.username,
          id: req.session.id_user,
          avatar: req.session.avatar
        },
        app_name: config.app_name
      });
    }
  }
  profil.leaderboard(callback);
});

module.exports = router;
