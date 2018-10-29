"use strict";

let multer = require("multer"),
    upload = multer({ dest: "./utils/uploads/" });

let config = require("../utils/config");

let jwt = require("jsonwebtoken"),
    jwtSecret = config.secret.jwt;

var controller = require("../controllers/controller"),
    user = require("../controllers/userController");

module.exports = (app, passport) => {
    // Testing endpoint
    app.all("/ping", controller.ping);
    // Testing endpoint w/ Authentication
    app.all("/api/ping", controller.ping);

    // Authentication Filter
    app.all("/api/*", function(req, res, next) {
        console.log(`[${new Date().toLocaleString}] ${req.ip}: ${req.path}`);
        if (
            /^\/auth\/?/.test(req.path) ||
            /\/avatar\/./.test(req.path) ||
            /\/qr\/./.test(req.path)
        )
            next();
        else
            passport.authenticate("userJwt", { session: false })(
                req,
                res,
                next,
            );
    });

    /**
     * **********************
     * *** Authentication ***
     * **********************
     */

    app.put("/auth", function(req, res, next) {
        passport.authenticate("user", { session: false }, (err, user, info) => {
            if (err || !user)
                return res.status(400).json({
                    message: info,
                });

            req.login(user, { session: false }, err => {
                if (err) return res.send(err);

                // generate a signed json web token with the contents of user object and return it in the response
                const token = jwt.sign(user, jwtSecret);
                return res.json({ user, token });
            });
        })(req, res, next);
    });

    /**
     * ************
     * *** User ***
     * ************
     */

    app.post("/users", user.signup);
    app.get("/users/avatar/:id", user.getAvatar);

    /* After Login*/
    app.route("/api/users").get();
    app.post("api/users/avatar", upload.single("avatar"), user.uploadAvatar);

    //TODO
};
