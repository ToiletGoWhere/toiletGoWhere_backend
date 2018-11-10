"use strict";

const config = require("./utils/config"),
    PORT = config.server.http_port,
    ROUTES = config.server.route,
    DB_ADDR = config.db.addr;

let express = require("express"),
    app = express(),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    MongoStore = require("connect-mongo")(session);

let cors = require("cors");

var corsOptions = {
    origin: function(origin, callback) {
        if (
            origin &&
            (/^https?\:\/\/127\.0\.0/.test(origin) ||
                /^chrome-extension:\/\//.test(origin) ||
                /^https?\:\/\/localhost/.test(origin))
        ) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
};

// Enable cors if frontend is deployed on the cloud
// app.use(cors(corsOptions));
// CORS for all
app.use(cors());

// Passport
let passport = require("passport"),
    strategies = require("./utils/authStrategy");

// Mongoose
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
    DB_ADDR,
    { useNewUrlParser: true },
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
passport.use("user", strategies.userLocalStrategy);
passport.use("userJwt", strategies.userJwtStrategy);

let routes = require(ROUTES);
routes(app, passport);

app.listen(PORT, async () => {
    console.log("Server is listening to port " + PORT);
});
