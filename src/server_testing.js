const Logger             = require('logger'),
      logger             = Logger.getLogger('ztnr-proxy.testing'),
      properties         = require('properties')(process.env.NODE_ENV),
      common             = require('common')('ztnr-proxy'),
      content_middleware = require('content-negotiator').middleware,
      express            = require('express'),
      path               = require('path');

// Configuración para simular entorno de producción  (grunt pro)
var isDevMode = process.argv.slice(2)[0] === 'nobuild',
    baseFolder = isDevMode ? '.' : '../dist';

// Configuraciones iniciales
const app = express();
const ztnrProxy = require(path.join(__dirname, baseFolder, 'app.js'));

const serve = () => {
  logger.info(`Server testing listening http://localhost:${server.address().port}/${properties.service_path}`);
};

// MIDDLEWARE Y ROUTING
app
  .use(ztnrProxy)
  .use(content_middleware.expressNegocaitor)  // formatea respuestas según lo que se envía
  .use(common.middlewares.errorStatus, common.middlewares.errorRequest);   

// Lanza el servidor de testing
const server = app.listen(properties.nodePort, serve);        

module.exports = app;