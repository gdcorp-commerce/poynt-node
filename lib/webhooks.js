/**
 * @file Webhook APIs
 */

 var helpers = require('./helpers');

 /**
  * Subscribes to a webhook
  * @param {String} options.eventType
  * @param {String[]} options.eventTypes
  * @param {String} options.businessId
  * @param {String} options.deliveryUrl
  * @param {String} options.secret
  */
 module.exports.createHook = function (options, next) {
   if (options.eventType) {
     options.eventType = options.eventTypes || [];
     options.eventTypes.push(options.eventType);
   }

   var hasErr = helpers.hasKeys(options, ['eventTypes', 'businessId', 'deliveryUrl', 'secret']);
   if (hasErr) { return next(hasErr); }

   this.request({
     url    : '/hooks/',
     method : 'POST',
     body   : {
       applicationId : this._applicationId,
       businessId    : options.businessId,
       deliveryUrl   : options.deliveryUrl,
       secret        : options.secret,
       eventTypes    : options.eventTypes
     }
   }, next);
 };
