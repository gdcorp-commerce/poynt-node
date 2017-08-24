/**
 * @file Order APIs
 */

var helpers = require('./helpers');
var qs      = require('querystring');

/**
 * Get all orders at a business.
 * @param {String} options.businessId
 * @param {String} options.startAt - the time from which to start fetching transactions
 * @param {Integer} options.startOffset
 * @param {String} options.endAt - the time at which to stop fetching transactions
 * @param {Integer} options.limit - the number of orders to fetch
 * @param {String} options.cardNumberFirst6 - limit results to orders with transactions done by cards starting with these 6 numbers
 * @param {String} options.cardNumberLast4 - limit results to orders with transactions done by cards ending with these 4 numbers
 * @param {Integer} options.cardExpirationMonth - limit results to orders with transactions done by cards expiring in this month
 * @param {Integer} options.cardExpirationYear - limit results to orders with transactions done by cards expiring in this year
 * @param {String} options.cardHolderFirstName - limit results to orders with transactions done by cards with this card holder first name
 * @param {String} options.cardHolderLastName - limit results to orders with transactions done by cards with this card holder last name
 * @param {String} options.storeId  - only fetch transactions for this store
 * @param {String} options.includeStaysAll
 * @return {Order[]} orders
 */
module.exports.getOrders = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) { return next(hasErr); }

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
    'cardHolderLastName',
    'storeId',
    'includeStaysAll',
  ]);

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/orders?' + qs.stringify(query),
    method : 'GET'
  }, next);
};

/**
 * Get a single order at a business.
 * @param {String} options.businessId
 * @param {String} options.orderId
 * @return {Business} business
 */
module.exports.getOrder = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'orderId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/orders/' + encodeURIComponent(options.orderId),
    method : 'GET'
  }, next);
};
