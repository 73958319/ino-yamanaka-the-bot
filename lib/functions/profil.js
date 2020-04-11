const mongoose = require("mongoose");

const schema = mongoose.Schema({
  id_user: { type: String },
  xp: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  money: { type: Number, default: 500 },
  username: { type: String },
  level: { type: Number, default: 0 }
});

const Profil = mongoose.model("profils", schema);

mongoose.connect(process.env.connexionMongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

module.exports.creer_profil = (id, username, xp, reputation, money) => {
  Profil.findOne({ id_user: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) {
        const nouveau_profil = new Profil({
          id_user: id,
          username: username,
          xp: xp,
          reputation: reputation,
          money: money,
          level: 0
        });

        nouveau_profil.save();
      }
    }
  });
};

module.exports.voir_profil = (id, callback) => {
  Profil.findOne({ id_user: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) return callback("not_found");
      doc.toObject({ getters: true });
      callback(doc);
    }
  });
};

module.exports.supprimer_profil = id => {
  Profil.deleteOne({ id_user: id });
};

function needToLevelUp(xp, level) {
  return Math.floor(xp / 300) === level ? false : true;
}

// fonction pas bonne car xp = xp total + new xp
module.exports.modifier_profil = (id, username, type, valeur) => {
  Profil.findOne({ id_user: id }).exec((err, new_profil) => {
    switch (type) {
      case "xp":
        new_profil.xp = valeur;
        if (needToLevelUp(valeur, new_profil.level))
          new_profil.level = new_profil.level + 1;
        new_profil.username = username;
        break;
      case "reputation":
        new_profil.reputation = valeur;
        break;
      case "money":
        new_profil.money = valeur;
        break;
    }

    new_profil.save();
  });
};

module.exports.leaderboard = callback => {
  Profil.find()
    .sort({ xp: -1 })
    .exec((err, result) => {
      if (err) throw err;
      callback(result);
    });
};
