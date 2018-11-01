"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let UserSchema = require("./userSchema"),
    ToiletSChema = require("./toiletSchema");

module.exports = mongoose.model(
    "Feedback",
    new Schema({
        user: UserSchema,
        toilet: ToiletSChema,
        content: String,
        rating: {
            type: Number,
            validate: () => {
                return !this.rating || (this.rating >= 0 && this.rating <= 5);
            },
        },
    }),
);
