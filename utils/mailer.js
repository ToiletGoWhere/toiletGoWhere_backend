"use strict";
let nodemailer = require("nodemailer");

exports.sendMail = async args => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "merlionsharing@gmail.com",
            pass: "uxsqmhrnizphuyoy",
        },
    });

    let options = {
        from: "Toilet Go Where <merlionsharing@gmail.com>",
        to: args.recipientAddr,
        subject: `Report ${args.recipientName}`,
        html: `<!DOCTYPE html>`,
    };

    transporter.sendMail(options, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log(
                `Email sent ${info.response} delivered to: ${receiver.email}`,
            );
        }
    });
};
