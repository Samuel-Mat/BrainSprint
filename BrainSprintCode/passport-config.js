const { authenticate } = require("passport");
const bcrypt = require("bcrypt");
const UserModel = require("./models/userModel");
const LocalStrategy = require("passport-local").Strategy;

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    let user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "Password or Email is wrong1" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password or Email is wrong" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initialize;
