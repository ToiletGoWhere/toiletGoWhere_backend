"use strict";

exports.ping = (req, res) => {
    console.log(
        `${new Date().toLocaleString()}|A request for ${req.originalUrl}`,
    );
    res.status(200).send("Server is running properly...");
};
