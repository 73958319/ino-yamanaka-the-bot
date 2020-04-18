const mongoose = require("mongoose");

const schema = mongoose.Schema({
  servers_count: { type: Number },
  members_count: { type: Number },
  type: String
});

const stats = mongoose.model("stats", schema);

mongoose.connect(process.env.connexionMongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

module.exports.create = (servers_count, members_count) => {
  stats.findOne({ type: "stats" }).exec((err, doc) => {
    if (!err) {
      if (doc === null) {
        const new_stats = new stats({
          servers_count: servers_count,
          members_count: members_count,
          type: "stats"
        });
        new_stats.save();
      }
      if (doc !== null) {
        doc.servers_count = servers_count;
        doc.members_count = members_count;
        doc.save();
      }
    }
  });
};

module.exports.see = (callback) => {
  stats.findOne({type: "stats"}).exec((err, doc) => {
    if (!err) {
      if (doc === null) return callback("not_found");
      doc.toObject({ getters: true });
      callback(doc);
    }
  });
};