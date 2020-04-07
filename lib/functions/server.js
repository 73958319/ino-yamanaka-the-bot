const mongoose = require("mongoose");

const schema = mongoose.Schema({
  server: { type: String },
  prefix: { type: String },
  welcome_channel: { type: String, default: null},
  welcome_message: {type: String, default:"Bienvenue {membre}."}
});

const Profil = mongoose.model("server", schema);

mongoose.connect(process.env.connexionMongoDB, { useUnifiedTopology: true,useNewUrlParser: true });

module.exports.set_welcome_message = (id, message) => {
  Profil.findOne({ server: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) {
        const nouveau_profil = new Profil({
          server: id,
          prefix: "o?",
          welcome_channel: null,
          welcome_message:"Welcome {member}."
        });
      }
      if (doc !== null) {
        doc.welcome_message = message;
        doc.save();
      }
    }
  });
};

module.exports.set_welcome_channel = (id, id_channel) => {
  Profil.findOne({ server: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) {
        const nouveau_profil = new Profil({
          server: id,
          prefix: "o?",
          welcome_channel: id_channel,
          welcome_message:"Welcome {member}."
        });

        nouveau_profil.save();
      }
      if (doc !== null) {
        doc.welcome_channel = id_channel;
        doc.save();
      }
    }
  });
};

module.exports.set_prefix = (id, prefix) => {
  Profil.findOne({ server: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) {
        const nouveau_profil = new Profil({
          server: id,
          prefix: prefix,
          welcome_channel:null,
          welcome_message:"Welcome {member}."
        });

        nouveau_profil.save();
      }
      if (doc !== null) {
        doc.prefix = prefix;
        doc.save();
      }
    }
  });
};

module.exports.see_server = (id,callback) => {
  Profil.findOne({ server: id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) return callback("not_found");
      doc.toObject({ getters: true });
      callback(doc);
    }
  });
};