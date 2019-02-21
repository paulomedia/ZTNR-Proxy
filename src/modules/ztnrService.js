/**
 * Modulo JS ztnrService
 * 
 * @module ztnrService
 */

const config  = require('./config'),
      request = require('request'),
      Logger  = require('logger'),
      logger  = Logger.getLogger('ztnr-proxy.ztnrService');

/**
* @function ztnrRequest Make a request to ZTNR Token service
* @param {object} params Params in { urlztnr }
* @return {promise} promise that resolve or reject
*/
const ztnrRequest = params => {

    const ztnrTokenUrl = config.getZtnrTokenUrl(params);

    return new Promise((resolve, reject) => {
        request(ztnrTokenUrl, (error, response, body) => {
            logger.debug(`ztnrService ztnrRequest url => ${ztnrTokenUrl} `);

            let status = response && response.statusCode;

            // if a error ocured we don't have a status code if we don't recived response
            if ( error ){
                logger.error(`ztnrService ztnrRequest error => ${error} `);
                reject(error);
                return;
            }
    
            // if is a status distinct of 200, reject it
            if ( status !== 200 ){
                logger.warn(`ztnrService ztnrRequest statusCode => ${status} `);
                reject(status);
                return;
            }
            resolve(body);
        });
    });
};

module.exports = {
    /**
    * @function getData Get data to the ZTNR Token service
    * @param {object} params Params in { urlztnr }
    * @return {promise} promise that resolve or reject
    */
    getData(params){
        return new Promise((resolve, reject) => {
            ztnrRequest(params).then(data => {
                logger.debug(`ztnrService getData data => ${data} `);
                resolve(data);
            }).catch(error => {
                logger.error(`ztnrService getData error => ${error} `);
                reject(error);
            });
        });
    }
};