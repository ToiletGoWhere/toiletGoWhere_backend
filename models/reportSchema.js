"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let UserSchema = require("./userSchema"),
    ToiletSchema = require("./toiletSchema");

module.exports = mongoose.model(
    "Report",
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: UserSchema,
        },
        toilet: {
            type: Schema.Types.ObjectId,
            ref: ToiletSchema,
        },
        content: String,
        reportType: String,
        pictures: [String],
    }),
);
