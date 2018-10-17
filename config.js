var config = {};

config.db = {};
config.server = {};
config.secret = {};

config.db.addr = 'mongodb://localhost/toiletGoWhere';

config.server.http_port = 3000;
config.server.route = './routes/routes';

config.secret.jwt = 'A_Random_Secret_String';

module.exports = config;