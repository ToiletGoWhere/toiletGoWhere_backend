"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

module.exports = mongoose.model(
    "Feedback",
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        toilet: {
            type: Schema.Types.ObjectId,
            ref: "Toilet",
        },
        content: String,
        rating: {
            type: Number,
            validate: {
                validator: val => val >= 0 && val <= 5,
                message: val => `${val.value} is not a valid rating!`,
            },
            set: val => val.toFixed(2),
        },
    }),
);
