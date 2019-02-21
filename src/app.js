const properties      = require('properties')(process.env.NODE_ENV),
      express         = require('express'),
      proxyController = require('./routes/proxyController');

let app = express();
app.use(`/${properties.service_path}`, proxyController);

module.exports = app;