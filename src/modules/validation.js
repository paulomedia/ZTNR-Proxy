/**
 * Modulo JS validation
 * 
 * @module validation
 */

 const config = require('./config'),
       Logger = require('logger'),
       logger = Logger.getLogger('ztnr-proxy.validate');

/**
 * @function validateLocal check if the locale param are valid ( have 2 caracters )
 * @param {string} locale country param
 * @return {boolean}
*/
const validateLocale = locale => {
    return /^[a-zA-Z]{2}$/.test(locale);
};

/**
 * @function validateId check if the id param are valid ( have 7 digits and are from the type number or string )
 * @param {string} id id param
 * @return {boolean}
*/
const validateId = id => {
    return /^[0-9]{7}$/.test(id);
};

/**
 * @function isValidMediaType check if the media param are valid ( are from audi or video type )
 * @param {string} type tipo param
 * @return {boolean}
*/
const isValidMediaType = type => {
    return /(audios|videos)/gi.test(type);
};

/**
 * @function isModeThree Check if the urlztnr is a modeThree ( /ztnr/consumer )
 * @param {string} url url param
 * @return {boolean}
*/
const isModeThree = url => {
    return /\/ztnr\/consumer/gi.test(url); 
};

/**
 * @function isModeTwo Check if the urlztnr is a modeTwo ( /ztnr/móvil/thumbnail )
 * @param {string} url url param
 * @return {boolean}
*/
const isModeTwo = url => {
    return /\/ztnr\/movil\/thumbnail\//gi.test(url);
};

/**
 * @function isModeOne Check if the urlztnr is a modeOne ( /ztnr/res )
 * @param {string} url url param
 * @return {boolean}
*/
const isModeOne = url => {
    return /\/ztnr\/res\//gi.test(url); 
}

/**
 * @function isValidPath check if the url of the ztnr url service have a valid path
 * @param {string} url url param
 * @return {boolean}
*/
const isValidPath = url => {
    return isModeTwo(url) || isModeThree(url);
};

/**
 * @function validateUrlZtnr check if the ztnr url are a valid url
 * @param {string} url url param
 * @return {promise} Promise that resolve or reject
*/
const validateUrlZtnr = url => {
    return new Promise((resolve, reject) => {

        if ( !isValidPath(url) ){
            logger.error(`Validate => No valid path `);
            return reject(false);
        }
        
        let assetId;
    
        if ( isModeTwo(url) ){
            assetId = url.split('/')[6].split('.')[0];
    
            if ( !validateId(assetId) ){        
                logger.error(`Validate => No valid assetid in ModeTwo `);
                return reject(false);
            }
    
            const type = url.split('/')[5];
            if ( !isValidMediaType(type) ){
                logger.error(`Validate => No valid media type in ModeTwo `);
                return reject(false);
            }
            resolve(assetId);
    
        }
    
        if ( isModeThree(url) ){
            const assetIdService = require('./assetIdService');
    
            assetIdService.getAssetId(url).then(data => {    
                assetId = data;
    
                if ( !validateId(assetId) ){
                    logger.error(`Validate => No valid assetid in ModeThree `);
                    return reject(false);
                }
                resolve(assetId);
    
            }).catch(error => {
                logger.error(`Validate => Error requesting the assetId in ModeThree `);
                return reject(false);
            });
            
        }
        

    });

};

module.exports = {
    /**
     * @function params check if the params in are valid
     * @param {object} req request object send by controller
     * @param {object} res response object send by controller
     * @param {function} next request object send by controller
    */
    params(req, res, next){

        if ( !req ) {
            logger.error(`Validate => No request `);
            return res.status(400).send('Bad Request');
        }

        const urlztnr = req.query.urlztnr;

        if ( isModeOne(urlztnr) ){
            logger.error(`Validate => No acceptable mode ( ModeOne ) `);
            return res.status(406).send('Not Acceptable');
        }

        const locale = req.query.locale;

        if ( !validateLocale(locale) ){
            logger.error(`Validate => No valid locale `);
            return res.status(400).send('Bad Request');
        }

        validateUrlZtnr(urlztnr).then(value => {
            if ( typeof value === 'string' ){
                req.query.assetId = value;
            }
            return next();
        }).catch(error => {
            logger.error(`Validate => No validUrlZtnr `);
            return res.status(400).send('Bad request');
        });

    }

};