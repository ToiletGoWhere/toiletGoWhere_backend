"use strict";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

module.exports = mongoose.model(
    "User",
    new Schema({
        email: String,
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
        avatar: String,
    }),
);
