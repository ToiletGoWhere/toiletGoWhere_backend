"use strict";

let mongoose = require("mongoose"),
    Schema = mongoose.Schema;
let UserSchema = require("./userSchema"),
    ToiletSChema = require("./toiletSchema");

module.exports = mongoose.model(
    "Report",
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
        reportType: String,
        pictures: [String],
    }),
);
