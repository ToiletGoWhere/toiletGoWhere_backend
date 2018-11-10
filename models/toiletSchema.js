"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

module.exports = mongoose.model(
    "Toilet",
    new Schema({
        toiletType: {
            type: String,
            enum: ["male", "female", "unisex", "nursing", "accessible"],
            lowercase: true,
            required: true,
        },
        location: {
            type: Array, // [latitude, longitude, level]
            validate: {
                validator: val => val.length == 3,
                message: val => `location length is ${val.length}`,
            },
        },
        confirmed: { type: Boolean, default: false },
        vote: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        numFeedback: { type: Number, default: 0 },
    }),
);
