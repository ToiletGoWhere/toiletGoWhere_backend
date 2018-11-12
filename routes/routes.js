"use strict";

let multer = require("multer"),
    upload = multer({ dest: "./utils/uploads/" });

let keystore = require("../utils/keystore");

let jwt = require("jsonwebtoken"),
    jwtSecret = keystore.jwt;

let user = require("../controllers/userController"),
    toilet = require("../controllers/toiletController");

module.exports = (app, passport) => {
    // Console Logger
    app.all("/api/*", (req, res, next) => {
        console.log(`[${new Date().toLocaleString()}] ${req.ip}: ${req.path}`);
        next();
    });
    // Testing endpoint
    app.all("/api/ping", (req, res) => {
        res.status(200).send("Server is running properly...");
    });
    // Testing endpoint w/ Authentication
    app.all("/api/auth/ping", (req, res) => {
        res.status(200).send(
            "Server is running properly with Authentication enabled...",
        );
    });

    // Authentication Filter
    app.all("/api/auth/*", function(req, res, next) {
        if (/^\/login\/?/.test(req.path)) {
            next();
        } else {
            passport.authenticate("userJwt", { session: false })(
                req,
                res,
                next,
            );
        }
    });

    /**
     * **********************
     * *** Authentication ***
     * **********************
     */

    app.put("/api/login", function(req, res, next) {
        let userController = user;
        passport.authenticate("user", { session: false }, (err, user, info) => {
            if (err || !user)
                return res.status(400).json({
                    message: info,
                });

            req.login(user, { session: false }, async err => {
                if (err) return res.send(err);
                // generate a signed json web token with the contents of user object and return it in the response
                const token = jwt.sign(user, jwtSecret, { expiresIn: "30d" });
                user = await userController.getUser(user._id);
                return res.json({ user, token });
            });
        })(req, res, next);
    });

    /**
     * **************
     * *** Toilet ***
     * **************
     */
    app.get("/api/toilets/:lat/:lng/:lvl/:type", toilet.getToilets);
    app.get("/api/toilets/:lat/:lng", toilet.getToilets);

    /* After Login */
    app.post("/api/auth/toilets", toilet.addToilet);
    app.put("/api/auth/toilets/:tId", toilet.confirmToilet);

    /**
     * ****************
     * *** Feedback ***
     * ****************
     */

    app.get("/api/feedbacks/:tId", toilet.getFeedbacks);
    app.get("/api/feedback/:fId", toilet.getFeedback);

    /* After Login */
    app.post("/api/auth/feedbacks/:tId", toilet.addFeedback);

    app.post("/api/auth/reports", upload.array("pic"), toilet.submitReport);

    /**
     * ************
     * *** User ***
     * ************
     */

    app.post("/api/users", user.signup);
    app.get("/api/users/avatar/:uId", user.getAvatar);

    /* After Login*/
    app.route("/api/auth/users/:uId").get(user.getUser); // FIXME: use case?
    app.put("/api/auth/users/", user.updateUser);
    app.put("/api/auth/users/avatar", upload.single("pic"), user.uploadAvatar);
};
