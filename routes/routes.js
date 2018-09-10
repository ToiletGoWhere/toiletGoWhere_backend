'use strict'

var multer = require('multer')
// upload = multer({dest: './uploads/'})

var jwt = require('jsonwebtoken'),
    jwtSecret = 'JWT Secret Goes Here';

var controller = require('../controllers/controller')

module.exports = (app, passport) => {

    app.all('*', controller.ping(res, req));

    //TODO
}