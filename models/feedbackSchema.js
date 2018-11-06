"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let UserSchema = require("./userSchema"),
    ToiletSChema = require("./toiletSchema");

module.exports = mongoose.model(
    "Feedback",
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: UserSchema,
        },
        toilet: {
            type: Schema.Types.ObjectId,
            ref: ToiletSChema,
        },
        content: String,
        rating: {
            type: Number,
            validate: {
                validator: val => val.value >= 0 && val.value <= 5,
                message: val => `${val.value} is not a valid rating!`,
            },
        },
    }),
);
