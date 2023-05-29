//Followed the tutorial of: https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/
// https://www.youtube.com/watch?v=-RCnNyD0L-s

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const UserModel = require("./models/userModel");

const initializePassport = require("./passport-config.js");
initializePassport(
  passport,
  async (email) => {
    const data = await UserModel.findOne({
      email: { $eq: email },
    });
    return data;
  },
  async (id) => {
    const data = await UserModel.findOne({
      _id: { $eq: id },
    });
    return data;
  }
);

require("dotenv").config();

const app = express();

app.set("view-engine", "ejs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
  );
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(methodOverride("_method"));
app.use(express.static("./public"));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", checkAuthenticated, (req, res) => {
  console.log(req.user);
  res.render("index.ejs");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login",
    failureFlash: true,
  })
);

app.delete("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/quizcreator", checkAuthenticated, (req, res) => {
  res.render("quizcreator.ejs");
});

app.get("/play", checkAuthenticated, (req, res) => {
  res.render("play.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const data = new UserModel({
      userName: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      owner: null,
      added: null,
      currentlyPlaying: null,
    });

    const dataToSave = await data.save();
    res.redirect("/login");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use(express.json());
app.use("/api", routes);

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
