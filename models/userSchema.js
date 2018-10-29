"use strict";

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

module.exports = mongoose.model(
  "User",
  new Schema({
    email: String,
    password: String,
    username: String,
    gender: {
      type: String,
      enum: ["male", "female", "unspecified"],
      lowercase: true,
      default: "unspecified"
    },
    avatar: {
      data: String,
      contentType: String
    }
  })
);
