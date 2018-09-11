'use strict'

const config = require('./config'),
    PORT = config.server.http_port,
    ROUTES = config.server.routes
    // DB_ADDR = config.db.addr;

var express = require('express'),
    app = express(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    MongoStore = require('connect-mongo')(session);

// Passport
var passport = require('passport'),
    LocalStratagy = require('passport-local').Strategy,
    passportJwt = require('passport-jwt'),
    JwtStrategy = passportJwt.Strategy,
    ExtractJwt = passportJwt.ExtractJwt;

// Mongoose
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(DB_ADDR);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());

var routes = require(ROUTES);
routes(app, passport);

app.listen(PORT);