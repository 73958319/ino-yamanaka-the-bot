const express = require("express");
const app = express();
const router = require("./router.js");
const session = require("express-session");

app.use(express.static("public"));
app.use(
  session({
    secret: process.env.secretSession,
    resave: true,
    saveUninitialized: true
  })
);

  app.use(express.urlencoded());
  app.use(express.json());

app.set("view engine", "ejs");
app.use(router);

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log("Port", listener.address().port);
});
