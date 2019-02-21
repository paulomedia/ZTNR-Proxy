const express  = require('express'),
      router   = express.Router(),
      service  = require('../services/proxyService'),
      validate = require('../modules/validation'),
      Logger   = require('logger'),
      logger   = Logger.getLogger('ztnr-proxy.proxyController');

const proxyController = (req, res) => {
    logger.info(`ProxyController `);

    service.getData(req).then(data => {
        logger.info(`ProxyController service.getData data =>  ${data} `);

        if ( !data ){
            logger.error(`ProxyController service.getData data status => ${403} `);
            res.status(403).send('Forbidden');
            return;
        }

        logger.info(`ProxyController service.getData data status => ${200} `);
        res.status(200).send(data);

    }).catch(error => {
        logger.error(`ProxyController service.getData error status => ${403} `);
        res.status(403).send('Forbidden');
    });

};

// ROUTING
router.get('/', validate.params, proxyController);

module.exports = router;