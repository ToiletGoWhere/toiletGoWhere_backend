var config = {};

config.db = {};
config.server = {};

config.db.addr = 'mongodb://localhost/toiletGoWhere';

config.server.http_port = 3000;
config.server.route = './routes/routes';

module.exports = config;