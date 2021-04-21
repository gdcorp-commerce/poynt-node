/**
 * @file Processing accounts APIs
 */

var helpers = require("./helpers");
var qs = require("querystring");

/**
 * Get all processing accounts
 * @param {String} options.applicationId (optional) - Payfac application id
 * @param {String} options.customerId (optional)
 * @param {String} options.organizationId (optional) – if specified, must match application token
 * @param {String} options.serviceId (optional)
 * @param {String} options.serviceType (optional)
 * @param {String} options.shopperId (optional)
 * @param {String} options.ventureId (optional)
 * @param {Number} options.page
 * @param {Number} options.size
 * @return {ProcessingAccount[]} processingAccounts
 */
module.exports.getProcessingAccounts = function getProcessingAccounts(
  options,
  next
) {
  var query = helpers.getKeys(options, [
    "applicationId",
    "customerId",
    "organizationId",
    "serviceId",
    "serviceType",
    "shopperId",
    "ventureId",
    "page",
    "size",
  ]);

  this.request(
    {
      url: "/processing-accounts?" + qs.stringify(query),
      app: "WEB",
      method: "GET",
    },
    next
  );
};
