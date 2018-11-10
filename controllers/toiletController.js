"use strict";

let Toilet = require("../models/toiletModel"),
    Feedback = require("../models/feedbackModel"),
    User = require("../models/userModel"),
    Report = require("../models/reportModel");

let fileUpload = require("../utils/fileUpload"),
    mailer = require("../utils/mailer");

let locationParser = (lat, lng, lvl) => {
    if (
        !(-90 <= lat && lat <= 90) ||
        !(-180 <= lng && lng <= 180) ||
        !lvl instanceof Number
    ) {
        throw new Error(`Invalid Coordinate [${lat}, ${lng}, ${lvl}]`);
    }
    return [lat, lng, lvl];
};

let toiletTypeParser = type => {
    if (
        !["male", "female", "unisex", "nursing", "accessible"].includes(
            type.toLowerCase(),
        )
    ) {
        throw new Error(`Invalid Toilet Type ${type}`);
    }
    return type;
};

let toRadians = val => val * (Math.PI / 180);

let getDistance = (origin, dest) => {
    let lat1 = origin[0],
        lng1 = origin[1],
        lvl1 = origin[2] | 1,
        lat2 = dest[0],
        lng2 = dest[1],
        lvl2 = dest[2];

    let R = 6371e3; // metres
    let φ1 = toRadians(lat1);
    let φ2 = toRadians(lat2);
    let Δφ = toRadians(lat2 - lat1);
    let Δλ = toRadians(lng2 - lng1);

    let a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let d = R * c;

    return lvl1 == lvl2 ? d : d + 40;
};

exports.addToilet = async (req, res) => {
    let location, toiletType;
    try {
        location = locationParser(req.body.lat, req.body.lng, req.body.lvl);
        toiletType = toiletTypeParser(req.body.type);
    } catch (err) {
        res.status(400).send(err);
        return;
    }

    let toilet = new Toilet({
        toiletType: toiletType,
        location: location,
    });
    try {
        let done = await toilet.save();
        res.send(done);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.confirmToilet = async (req, res) => {
    let toilet = await Toilet.findById(req.params.tId);

    if (!toilet || toilet.confirmed) {
        res.status(400).send(new Error("Toilet not found"));
        return;
    }

    toilet.vote++;
    toilet.confirmed = toilet.vote >= 5 ? true : false;

    try {
        let done = await toilet.save();
        res.send(done);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getToilets = async (req, res) => {
    let lat = req.params.lat,
        lng = req.params.lng,
        lvl = req.params.lvl,
        type = req.params.type;

    lat = parseFloat(lat).toFixed(6);
    lng = parseFloat(lng).toFixed(6);

    let me, toilets;

    if (!type && req.user_id) {
        let user = User.findById(req.user._id);
        type = user.toiletType;
    }

    me = lvl ? [lat, lng, parseInt(lvl)] : [lat, lng];

    toilets = type
        ? await Toilet.find({ toiletType: { $in: [type, "unisex"] } })
        : await Toilet.find();

    let distanceArr = [];
    toilets.forEach((t, i) => {
        distanceArr.push({
            distance: getDistance(me, t.location),
            index: i,
        });
    });

    distanceArr.sort((a, b) => {
        return a.distance - b.distance;
    });

    let results = [];
    let size = distanceArr.length > 5 ? 5 : distanceArr.length;
    for (let i = 0; i < size; i++) {
        let t = toilets[distanceArr[i].index];
        t = {
            ...t._doc,
            distance: distanceArr[i].distance,
        };
        results.push(t);
    }

    res.send(results);
};

exports.addFeedback = async (req, res) => {
    let uId = req.user._id;
    let tId = req.params.tId,
        toilet = await Toilet.findById(tId);
    let body = req.body;
    let feedback = new Feedback({
        toilet: tId,
        user: uId,
        content: body.content,
        rating: body.rating,
    });

    let newRating =
        (toilet.rating * toilet.numFeedback + body.rating) /
        (toilet.numFeedback + 1);

    let toiletUpdate = {
        numFeedback: toilet.numFeedback + 1,
        rating: newRating,
    };

    try {
        let done = await feedback.save();
        await Toilet.findByIdAndUpdate(tId, toiletUpdate, { new: true });
        res.send(done);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getFeedback = async (req, res) => {
    try {
        let feedback = await Feedback.findById(req.params.fId)
            .populate("user", "username email")
            .exec();
        res.send(feedback);
    } catch (err) {
        res.status(404).send({ error: "Invalid Feedback ID" });
    }
};

exports.getFeedbacks = async (req, res) => {
    try {
        let toilet = await Toilet.findById(req.params.tId);
        let feedbacks = await Feedback.find({ toilet: toilet })
            .populate("user", "username email")
            .exec();
        res.send(feedbacks);
    } catch (err) {
        res.status(400).send({ error: "Unexpected Database Error" });
    }
};

exports.submitReport = async (req, res) => {
    let files = req.files;
    let pictures = [];
    files.forEach(p => {
        pictures.push(fileUpload.getBase64Encoding(p));
    });

    let body = req.body;
    let report = new Report({
        toilet: body.tId,
        user: req.user._id,
        content: body.content,
        reportType: body.reportType,
        pictures: pictures,
    });

    try {
        let done = await report.save();
        let toilet = await Toilet.findById(body.tId);
        mailer.sendMail({
            lat: toilet.location[0],
            lng: toilet.location[1],
            pictures: pictures,
        });
        res.send(done);
    } catch (err) {
        res.status(400).send(err);
    }
};
