let bcrypt = require("bcrypt"),
  LocalStrategy = require("passport-local").Strategy,
  passportJwt = require("passport-jwt"),
  JwtStrategy = passportJwt.Strategy,
  ExtractJwt = passportJwt.ExtractJwt,
  config = require("./config"),
  jwtSecret = config.secret.jwt;

let User = require("../models/userSchema");

exports.userLocalStrategy = new LocalStrategy(
  {
    usernameField: "email" //request body field name
  },
  (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log("Login failed.");
        return done(null, false, { message: "Login failed." });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (err || !res) {
          console.log("Login failed");
          return done(null, false, { message: "Login failed." });
        }
        return done(null, { _id: user._id });
      });
    });
  }
);

exports.userJwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
  },
  function(jwtPayload, cb) {
    return User.findById(jwtPayload._id)
      .then(user => {
        return cb(null, jwtPayload);
      })
      .catch(err => {
        return cb(err);
      });
  }
);
