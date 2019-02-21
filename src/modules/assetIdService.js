/**
 * Modulo JS assetIdService
 * 
 * @module assetIdService
 */

const config  = require('./config'),
      request = require('request'),
      Logger  = require('logger'),
      logger  = Logger.getLogger('ztnr-proxy.assetIdService');

/**
* @function assetIdRequest Get the assetid from ModeThree requests
* @param {string} urlztnr url from ztnr requesting by 
* @return {promise} Promise that resolve or reject
*/
const assetIdRequest = urlztnr => {
    const urlAssetid = config.getAssetIdUrl(urlztnr);
    
    return new Promise((resolve, reject) => {
        request(urlAssetid, (error, response, body) => {
            logger.info(`assetIdRequest assetIdRequest url => ${urlAssetid} `);

            let status = response && response.statusCode;

            if ( error ){
                logger.error(`assetIdRequest assetIdRequest error => ${error} `);
                return reject(error);
            }

            if ( status !== 200 ){
                logger.warn(`assetIdRequest assetIdRequest statusCode => ${status} `);
                return reject(status);
            }
            resolve(body);
        });
    });
};

module.exports = {
    /**
    * @function getAssetId Get the assetId for request of modeThree
    * @param {object} params Params in { idAsset, locale, uid, uidSignature, signatureTimestamp }
    * @return {promise} Promise that resolve or reject
    */
    getAssetId(urlztnr){
        return new Promise((resolve, reject) => {
            assetIdRequest(urlztnr).then(data => {
                logger.info(`assetIdRequest getAssetId status => ${data} `);
                resolve(data);
            }).catch(error => {
                logger.error(`assetIdRequest getAssetId error  => ${error} `);
                reject(error);
            });
        });
    }
};