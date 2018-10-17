'use strict'

const config = require('./config'),
    PORT = config.server.http_port,
    ROUTES = config.server.route,
    DB_ADDR = config.db.addr;

let express = require('express'),
    app = express(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    MongoStore = require('connect-mongo')(session);

// Passport
let passport = require('passport'),
    strategies = require('./authStrategy');

// Mongoose
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(DB_ADDR, { useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
passport.use('user', strategies.userLocalStrategy)
passport.use('userJwt', strategies.userJwtStrategy);

let routes = require(ROUTES);
routes(app, passport);

app.listen(PORT, async () => {
    console.log("Server is listening to port " + PORT);
});