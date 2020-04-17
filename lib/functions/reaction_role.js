const mongoose = require("mongoose");

const schema = mongoose.Schema({
  id_message: { type: String },
  reaction_and_role_id: { type: Array }
});

const reaction_role = mongoose.model("reaction_role", schema);

mongoose.connect(process.env.connexionMongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

module.exports.create = (id_message, reaction, role) => {
  reaction_role.findOne({ id_message: id_message }).exec((err, doc) => {
    if (!err) {
      if (doc === null) {
        const new_reaction_role = new reaction_role({
          id_message: id_message,
          reaction_and_role_id: [{[reaction] : role}]
        });

        new_reaction_role.save();
      }
      if(doc !== null) {
        doc.reaction_and_role_id.push({[reaction] : role})
        doc.save();
      }
    }
  });
};

module.exports.see = (id_message, callback) => {
  reaction_role.findOne({ id_message: id_message }).exec((err, doc) => {
    if (!err) {
      if (doc === null) return callback("not_found");
      doc.toObject({ getters: true });
      callback(doc);
    }
  });
};