'use strict'

const PORT = 3000,
    ROUTES = './routes/routes.js'
// DB_ADDR = 'mongodb://localhost/toiletGoWhere';

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