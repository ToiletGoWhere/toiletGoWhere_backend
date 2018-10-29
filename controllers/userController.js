"use strict";

let User = require("../models/userSchema"),
  bcrypt = require("bcrypt"),
  fileUpload = require("../utils/fileUpload");

exports.signup = async (req, res) => {
  let body = req.body,
    user = await User.findOne({ email: body.email });

  if (user) {
    res.status(400).send({ error: "Email taken." });
    return;
  }

  // Encrypt password with random salt
  let password = await bcrypt.hash(req.body.password, 10),
    newUser = new User({
      email: body.email,
      password: password
    }),
    result = await newUser.save();

  if (result instanceof Error) {
    res.status(400).send(result);
  } else {
    res.send({ id: result._id });
  }
};

exports.uploadAvatar = async (req, res) => {
  let id = req.user._id;
  let update = {
    avatar: {
      data: fileUpload.getBase64Encoding(req.file),
      contentType: req.file.mimetype
    }
  };
  let user = await User.findByIdAndUpdate(id, update);

  if (user instanceof Error)
    res.status(404).send({ error: "Avatar uploading failed" });
  else {
    res.setHeader("Content-Type", update.avatar.contentType);
    res.send(update.avatar.data);
  }
};

exports.getAvatar = async (req, res) => {
  let id = req.params("id");
  let user = await User.findById(id, "avatar");
};
