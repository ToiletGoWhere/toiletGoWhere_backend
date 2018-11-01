"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let FeedbackSchema = require("./feedbackSchema");

module.exports = mongoose.model(
    "Toilet",
    new Schema({
        toiletType: {
            type: String,
            enum: ["male", "female", "unisex", "nursing"],
            lowercase: true,
            required: true,
        },
        location: {
            type: Array, // [longitute, latitute, level]
            validate: [
                () => {
                    return this.location.length <= 3;
                },
                `location length is ${this.location.length}`,
            ],
        },
        confirmed: Boolean,
        vote: Number,
        rating: Number,
    }),
);
