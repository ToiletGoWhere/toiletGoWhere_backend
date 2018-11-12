"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let profile_pic = require("../utils/config").default.profile_pic;

module.exports = mongoose.model(
    "User",
    new Schema({
        email: {
            type: String,
            unique: true,
        },
        password: String,
        username: {
            type: String,
            default: `User_${Math.floor(Math.random() * 10000)}`,
        },
        toiletType: {
            type: String,
            enum: ["male", "female", "unisex", "nursing", "accessible"],
            lowercase: true,
        },
        avatar: {
            type: String,
            default: profile_pic,
        },
    }),
);
