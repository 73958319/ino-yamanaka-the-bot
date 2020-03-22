const mongoose = require("mongoose");

const schema = mongoose.Schema({
  server: { type: Number },
  prefix: { type: String }
});

const Profil = mongoose.model("prefix", schema);

mongoose.connect(process.env.connexionMongoDB);

module.exports.set_prefix = (id, prefix) => {
  Profil.findOne({ server: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) {
        const nouveau_profil = new Profil({
          server: id,
          prefix: prefix
        });

        nouveau_profil.save();
        console.log("profil créé");
      }
      if (doc !== null) {
        doc.prefix = prefix;
        doc.save();
      }
    }
  });
};

module.exports.see_prefix = (id,callback) => {
  Profil.findOne({ server: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) return callback("non_trouve");
      doc.toObject({ getters: true });
      callback(doc.prefix);
    }
  });
};