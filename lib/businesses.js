/**
 * @file Business APIs
 */

var helpers = require('./helpers');
var qs = require('querystring');

/**
 * @typedef MerchantPaymentAccount
 * @property {String} createdAt
 * @property {String} updatedAt
 * @property {Number} _id
 * @property {Object} processorData
 * @property {String} status
 * @property {String} acquirer
 * @property {String} issuer
 * @property {String} processor
 * @property {String} mid
 * @property {String} id
 */

/**
 * Gets a business by ID.
 * @param {String} options.businessId
 * @return {Business} business
 */
module.exports.getBusiness = function getBusiness(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId),
    method: 'GET'
  }, next);
};

/**
 * Gets a business by device ID.
 * @param {String} options.deviceId
 * @return {Business} business
 */
module.exports.getBusinessByDeviceId = function getBusinessByDeviceId(options, next) {
  var hasErr = helpers.hasKeys(options, ['deviceId']);
  if (hasErr) {
    return next(hasErr);
  }

  var query = {
    storeDeviceId: options.deviceId
  };

  this.request({
    url: '/businesses?' + qs.stringify(query),
    method: 'GET'
  }, next);
};

/**
 * Gets a merchant payment account by business ID and store ID.
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {Boolean} options.includeRemoved
 * @return {Array<MerchantPaymentAccount>} merchantPaymentAccount
 */
module.exports.getMerchantPaymentAccount = function getMerchantPaymentAccount(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'storeId']);

  if (hasErr) {
    return next(hasErr);
  }

  const includeRemoved = options.includeRemoved || false;

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/stores/' + encodeURIComponent(options.storeId) + '/merchant-payment-accounts?includeRemoved=' + includeRemoved,
    method: 'GET'
  }, next);
}

/**
 * Gets a pricing profile by ID.
 * @param {String} options.businessId
 * @return {Pricing} pricing
 */
module.exports.getPricingProfile = function getBusiness(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);

  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/api/services/businesses/' + encodeURIComponent(options.businessId) + '/pricing',
    method: 'GET',
    app: 'WEB'
  }, next);
};
