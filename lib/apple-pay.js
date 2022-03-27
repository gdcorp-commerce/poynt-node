/**
 * @file Apple Pay APIs
 */

var helpers = require("./helpers");

/**
 * Get merchant details by business id
 * @param {String}   options.businessId - the business ID
 */
module.exports.getApplePayRegistration = function (options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId"]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/apple-pay/registration`,
      method: "GET",
    },
    next
  );
};

/**
* Get domain association file
* @param {String}   options.businessId - the business ID
*/
module.exports.getApplePayDomainAssociationFile = function (options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId"]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/apple-pay/domain-association-file`,
      method: "GET",
    },
    next
  );
};

/**
 * Update merchant domain from Apple Pay server by business id 
 * @param {String}   options.businessId - the business ID
 * @param {String[]} options.unregisterDomains - List of fully qualified domain names where Apple Pay button is displayed
 * @param {String[]} options.registerDomains - List of fully qualified domain names where Apple Pay button is displayed
 * @param {String}   options.reason - Human readable reason of unregistration
 * @param {String}   options.merchantName - Merchant's e-commerce name
 * @param {String}   options.merchantUrl - Merchant site url where e-commerce store is hosted
 */
module.exports.updateApplePayRegistration = function (options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId"]);
  if (hasErr) {
    return next(hasErr);
  }

  var body = {};
  if (options.unregisterDomains) {
    body.unregisterDomains = options.unregisterDomains;
  }
  if (options.registerDomains) {
    body.registerDomains = options.registerDomains;
  }
  if (options.reason) {
    body.reason = options.reason;
  }
  if (options.merchantName) {
    body.merchantName = options.merchantName;
  }
  if (options.merchantUrl) {
    body.merchantUrl = options.merchantUrl;
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/apple-pay/registration`,
      method: "POST",
      body,
    },
    next
  );
};

module.exports.getApplePayMerchant = this.getApplePayRegistration
module.exports.registerApplePayMerchant = this.updateApplePayRegistration;
module.exports.unregisterApplePayMerchant = this.updateApplePayRegistration;