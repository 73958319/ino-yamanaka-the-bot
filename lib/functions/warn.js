const mongoose = require("mongoose");

const schema = mongoose.Schema({
  guild_id: { type: String },
  user_id: { type: String },
  executioner_id: { type: String },
  reason: { type: String }
});

const warns = mongoose.model("warns", schema);

mongoose.connect(process.env.connexionMongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

module.exports.create = (guild_id, user_id, executioner_id, reason) => {
  const new_warns = new warns({
    guild_id: guild_id,
    user_id: user_id,
    executioner_id: executioner_id,
    reason: reason
  });
  new_warns.save();
};

module.exports.see = (guild_id, user_id, callback) => {
  warns.find({ guild_id: guild_id, user_id: user_id }).exec((err, doc) => {
    if (!err) {
      if (doc === null) return callback("not_found");
      //doc.toObject({ getters: true });
      callback(doc);
    }
  });
};
