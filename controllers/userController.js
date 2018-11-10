"use strict";

let User = require("../models/userModel"),
    bcrypt = require("bcrypt"),
    fileUpload = require("../utils/fileUpload");

exports.signup = async (req, res) => {
    let body = req.body,
        user = await User.findOne({ email: body.email });

    if (user) {
        res.status(400).send({ error: "Email taken." });
        return;
    }

    // Encrypt password with random salt
    let password = await bcrypt.hash(req.body.password, 10),
        newUser = new User({
            email: body.email,
            password: password,
        }),
        result = await newUser.save();

    if (result instanceof Error) {
        res.status(400).send(result);
    } else {
        res.send({ id: result._id });
    }
};

exports.getUser = async (req, res) => {
    let id = req.params.uId;
    let user = await User.findById(id);
    user.password = null;
    res.send(user);
};

exports.updateUser = async (req, res) => {
    let id = req.user._id;
    let body = req.body;
    let update = {};
    if (body.username) update.username = body.username;
    if (body.toiletType) update.toiletType = body.toiletType;
    try {
        let done = await User.findByIdAndUpdate(id, update, { new: true });
        res.send(done);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.uploadAvatar = async (req, res) => {
    let id = req.user._id;
    let update = {
        avatar: fileUpload.getBase64Encoding(req.file),
    };

    try {
        let user = await User.findByIdAndUpdate(id, update, { new: true });
        res.send(user.avatar);
    } catch (err) {
        res.status(404).send({ error: "Avatar uploading failed" });
    }
};

exports.getAvatar = async (req, res) => {
    let id = req.params.uId;
    let user = await User.findById(id, "avatar");
    res.send(user.avatar);
};
