let fs = require("fs");

// Return the base64 encoding of a multer file
exports.getBase64Encoding = file => {
    let data = fs.readFileSync(file.path, "base64"),
        mimetype = file.mimetype;

    // Remove cached file
    fs.unlink(file.path, err => {
        if (err) console.log("Error while removing file");
        else console.log("Cached avatar file was deleted");
    });
    return `data:${mimetype};base64,${data}`;
};
