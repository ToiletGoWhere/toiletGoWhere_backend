let User = require('../models/userSchema'),
    bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    let body = req.body,
        user = await User.findOne({ email: body.email });

    if (user) {
        res.status(400).send({ error: "Email taken." });
        return
    }

    // Encrypt password with random salt
    let salt = await bcrypt.genSalt(),
        password = await bcrypt.hashSync(req.body.password + salt, 10),
        newUser = new User({
            email: body.email,
            password: password,
            salt: salt
        }),
        result = await newUser.save();

    if (result instanceof Error) {
        res.status(400).send(result);
    } else {
        res.send({ id: result._id });
    }
}