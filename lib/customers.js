/**
 * @file Customer APIs
 */

var helpers = require('./helpers');
var qs = require('querystring');

/**
 * Get all customers of a business by various criteria.
 * @param {String} options.businessId
 * @param {String} options.startAt (optional)
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional)
 * @param {Integer} options.limit (optional)
 * @param {String} options.cardNumberFirst6 (optional)
 * @param {String} options.cardNumberLast4 (optional)
 * @param {Integer} options.cardExpirationMonth (optional)
 * @param {Integer} options.cardExpirationYear (optional)
 * @param {String} options.cardHolderFirstName (optional)
 * @param {String} options.cardHolderLastName (optional)
 * @return {CustomerList} customers
 */
module.exports.getCustomers = function getCustomers(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, [
    'startAt',
    'startOffset',
    'endAt',
    'limit',
    'cardNumberFirst6',
    'cardNumberLast4',
    'cardExpirationMonth',
    'cardExpirationYear',
    'cardHolderFirstName',
    'cardHolderLastName'
  ]);

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/customers?' + qs.stringify(query),
    method: 'GET'
  }, next);
};

/**
 * Get a single customer at a business.
 * @param {String} options.businessId
 * @param {String} options.customerId
 * @return {Customer} customer
 */
module.exports.getCustomer = function getCustomer(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'customerId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/customers/' + encodeURIComponent(options.customerId),
    method: 'GET'
  }, next);
};
