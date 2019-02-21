/**
 * Modulo JS cdmService
 * 
 * @module cdmService
 */

const config  = require('./config'),
      request = require('request'),
      Logger  = require('logger'),
      logger  = Logger.getLogger('ztnr-proxy.cdmService');

/**
* @function cdmRequest Validate the content and the user
* @param {object} params Params in { idAsset, country, uid, uidSignature, signatureTimestamp }
* @return {promise} Promise that resolve or reject
*/
const cdmRequest = params => {
    const cdmUrl = config.getCdmUrl(params);

    return new Promise((resolve, reject) => {
        request(cdmUrl, (error, response, body) => {
            logger.debug(`cdmRequest cdmRequest url => ${cdmUrl} `);

            let status = response && response.statusCode;

            // if a error ocured we don't have a status code if we don't recived response
            if ( error ){
                logger.error(`cdmRequest cdmRequest error => ${error} `);
                reject(error);
                return;
            }

            // if is a status distinct of 200, reject it
            if ( status !== 200 ){
                logger.warn(`cdmRequest cdmRequest statusCode => ${status} `);
                reject(status);
                return;
            }
            resolve(status);
        });
    });
};

module.exports = {
    /**
    * @function autenticate Validate the content and the user from CDM Service
    * @param {object} params Params in { idAsset, locale, uid, uidSignature, signatureTimestamp }
    * @return {promise} Promise that resolve or reject
    */
    autenticate(params){
        return new Promise((resolve, reject) => {
            cdmRequest(params).then(status => {
                logger.info(`cdmRequest autenticate status => ${status} `);
                resolve(status);
            }).catch(error => {
                logger.error(`cdmRequest autenticate error  => ${error} `);
                reject(error);
            });
        });
    }
};