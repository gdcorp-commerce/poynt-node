/**
 * @file Processing accounts APIs
 */

var helpers = require('./helpers');
var qs = require('querystring');

/**
 * Get all processing accounts
 * @param {String} options.applicationId
 * @param {String} options.customerId
 * @param {String} options.serviceId
 * @param {String} options.serviceType
 * @param {Number} options.page
 * @param {Number} options.size
 * @return {ProcessingAccount[]} processingAccounts
 */
module.exports.getProcessingAccounts = function getProcessingAccounts(options, next) {
  var query = helpers.getKeys(options, [
    'applicationId',
    'customerId',
    'serviceId',
    'serviceType',
    'page',
    'size'
  ]);

  this.request({
    url: '/processing-accounts?' + qs.stringify(query),
    app: 'WEB',
    method: 'GET'
  }, next);
};
