const mongoose = require("mongoose");

const schema = mongoose.Schema({
  bonbon: { type: Number },
  xp: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  money: { type: Number, default: 500 }
});

const Profil = mongoose.model("schema", schema);

mongoose.connect(process.env.connexionMongoDB);

module.exports.creer_profil = (id, xp, reputation, money) => {
  Profil.findOne({ bonbon: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) {
        const nouveau_profil = new Profil({
          bonbon: id,
          xp: xp,
          reputation: reputation,
          money: money
        });

        nouveau_profil.save();
      }
    }
  });
};

module.exports.voir_profil = (id, callback) => {
  Profil.findOne({ bonbon: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) return callback("non_trouve");
      doc.toObject({ getters: true });
      callback(doc);
    }
  });
};

module.exports.supprimer_profil = id => {
  Profil.deleteOne({ bonbon: id });
};

module.exports.modifier_profil = (id, type, valeur) => {
  Profil.findOne({ bonbon: id }).exec((err, new_profil) => {
    switch (type) {
      case "xp":
        new_profil.xp = valeur;
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

module.exports.leaderboard = (callback) => {
  Profil.find().sort({xp:1}).exec((err, result) => {
    if (err) throw err;
      callback(result);
  });
}