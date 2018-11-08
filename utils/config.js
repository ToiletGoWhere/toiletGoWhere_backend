let config = {};

config.db = {};
config.db.addr = "mongodb://localhost/toiletGoWhere";

config.server = {};
config.server.http_port = 3000;
config.server.route = "./routes/routes";

config.secret = {};
config.secret.jwt = "A_Random_Secret_String";
config.secret.googleMapKey = "AIzaSyAQ2vkTBfGCJSae3KqB6C0VrbsN2TMHuSo";

module.exports = config;
