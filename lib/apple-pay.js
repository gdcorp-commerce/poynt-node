/**
 * @file Apple Pay APIs
 */

var helpers = require("./helpers");

/**
 * Register merchant domain to Apple Pay server by business id and returns registered domains on-file. 
 * @param {String} options.businessId - the business ID
 * @param {String[]} options.domainNames - List of fully qualified domain names where Apple Pay button is displayed
 * @param {String} options.merchantName - Merchant's e-commerce name
 * @param {String} options.merchantUrl - Merchant site url where e-commerce store is hosted
 */
module.exports.registerApplePayMerchant = function (options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "domainNames", "merchantName"]);
  if (hasErr) {
    return next(hasErr);
  }

  var body = {
    domainNames: options.domainNames,
    merchantName: options.merchantName,
  }
  if (options.merchantUrl) {
    body.merchantUrl = options.merchantUrl;
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/apple-pay/register`,
      method: "POST",
      body: body,
    },
    next
  );
};

/**
 * Unregister merchant domain from Apple Pay server by business id 
 * @param {String} options.businessId - the business ID
 * @param {String[]} options.domainNames - List of fully qualified domain names where Apple Pay button is displayed
 * @param {String} options.reason - Human readable reason of unregistration
 */
module.exports.unregisterApplePayMerchant = function (options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "domainNames"]);
  if (hasErr) {
    return next(hasErr);
  }
  var body = {
    domainNames: options.domainNames,
  }
  if (options.reason) {
    body.reason = options.reason;
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/apple-pay/unregister`,
      method: "POST",
      body: body,
    },
    next
  );
};

/**
 * Get merchant details by business id
 */
module.exports.getApplePayMerchant = function (options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId"]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/apple-pay/merchant`,
      method: "GET",
    },
    next
  );
};
 