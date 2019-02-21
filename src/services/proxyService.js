const ztnr       = require('../modules/ztnrService'),
      cdm        = require('../modules/cdmService'),
      config     = require('../modules/config'),
      Logger     = require('logger'),
      logger     = Logger.getLogger('ztnr-proxy.proxyService');

module.exports = {
    /**
    * @function getData Validate the content and the user and get data from zotaner to give to player, apps or another plataforms
    * @param {object} params Params in { country, uid, uidSignature, signatureTimestamp }
    * @return {promise} Promise that resolve or reject
    */
    getData(req){
        logger.debug(`ProxyService getData req      => ${req} `);

        const params = config.getParams(req);
        logger.debug(`ProxyService getData params   => ${JSON.stringify(params)} `);

        return new Promise((resolve, reject) => {
             // Validate the user and content from CDM Service 
            cdm.autenticate(params).then(status => {
                logger.info(`ProxyService cdm.autenticate status  => ${status}`);
                // Get the data from ZTNR Tokenizer Service
                ztnr.getData(params).then(data => {
                    logger.info(`ProxyService ztnr.getData data   => ${data}`);
                    resolve(data);
                }).catch(error => {
                    logger.error(`ProxyService ztnr.getData error => ${error}`);
                    reject(error);
                });
            }).catch(error => {
                logger.error(`ProxyService cdm.autenticate error  => ${error}`);
                reject(error);
            });
        });
    }
};