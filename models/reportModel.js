"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;

module.exports = mongoose.model(
    "Report",
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
        reportType: String,
        pictures: [String],
    }),
);
