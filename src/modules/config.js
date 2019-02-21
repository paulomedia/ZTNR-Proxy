/**
 * Modulo JS config
 * 
 * @module config
 */

const props = require('properties')(process.env.NODE_ENV);

module.exports = {    
    /**
     * @function getParams Return an object with the validated params
     * @param {object} req request object send by controller
     * @return {object} params return the params object
    */
    getParams(req){
        return { 
            country: req.query.locale,    
            urlztnr: req.query.urlztnr,
            idAsset: req.query.assetId,
            UID: req.query.UID,
            UIDSignature: req.query.UIDSignature,
            signatureTimestamp: req.query.signatureTimestamp
        };
    },

     /**
     * @function getCdmUrl get the url form CDM Service
     * @param {object} params params param
     * @return {string} return url from CDM Service
    */
    getCdmUrl(params){
        return props.cdm_protocol + '://' + props.cdm_host + ':' + props.cdm_port + props.cdm_path + '/' + params.idAsset + '/' + params.country.toUpperCase() + '/?UID=' + params.UID + '&UIDSignature=' + params.UIDSignature + '&signatureTimestamp=' + params.signatureTimestamp;
    },

     /**
     * @function getZtnrTokenUrl get the url for ZTNR Tokenizer
     * @param {object} params params param
     * @return {string} return url from CDM Service
    */
    getZtnrTokenUrl(params){
        return props.ztnr_token_protocol + '://' + props.ztnr_token_host + ':' + props.ztnr_token_port + props.ztnr_token_path + '/?urlztnr=' + params.urlztnr;
    },

    /**
     * @function getAssetIdUrl get the url for assetID service
     * @param {string} url urlztnr from params
     * @return {string} return url from assetId Service
    */
    getAssetIdUrl(url){
        return props.assetid_service_protocol + '://' + props.assetid_service_host + url.replace('/ztnr/', props.assetid_service_path);
    }

};