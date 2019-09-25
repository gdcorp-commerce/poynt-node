/**
 * @file Transaction APIs
 */

var helpers = require('./helpers');
var qs = require('querystring');

/**
 * Get all transactions that match the specified filters.
 * If no filter is specified it will fetch all transactions for the business
 * since it started.
 * @param {String} options.businessId
 * @param {String} options.startAt (optional) - the time from which to start fetching transactions
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional) - the time at which to stop fetching transactions
 * @param {Integer} options.limit (optional) - the number of transactions to fetch
 * @param {String} options.storeId (optional) - only fetch transactions for this store
 * @param {String} options.deviceId (optional) - only fetch transactions for this device
 * @param {String} options.searchKey (optional) - instead of specifying which exact field to look at, the client can simply pass this search key and the server will look at various different fields,
 * @param {String} options.cardNumberFirst6 (optional) - limit results to transactions done by cards starting with these 6 numbers
 * @param {String} options.cardNumberLast4 (optional) - limit results to transactions done by cards ending with these 4 numbers
 * @param {Integer} options.cardExpirationMonth (optional) - limit results to transactions done by cards expiring in this month
 * @param {Integer} options.cardExpirationYear (optional) - limit results to transactions done by cards expiring in this year
 * @param {String} options.cardHolderFirstName (optional) - limit results to transactions done by cards with this card holder first name
 * @param {String} options.cardHolderLastName (optional) - limit results to transactions done by cards with this card holder last name
 * @param {String} options.action (optional) - only fetch transactions with this action
 * @param {String} options.status (optional) - only fetch transactions with this status
 * @param {String} options.transactionIds (optional) - only fetch transactions matching these ids (comma separated)
 * @param {Boolean} options.authOnly (optional) - only fetch auth only transactions
 * @param {Boolean} options.unsettledOnly (optional) - only fetch unsettled transactions
 * @param {Boolean} options.creditDebitOnly (optional) - only fetch credit/debit transactions
 * @return {TransactionList} transactions
 */
module.exports.getTransactions = function getTransactions(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, [
    'startAt',
    'startOffset',
    'endAt',
    'limit',
    'storeId',
    'deviceId',
    'searchKey',
    'cardNumberFirst6',
    'cardNumberLast4',
    'cardExpirationMonth',
    'cardExpirationYear',
    'cardHolderFirstName',
    'cardHolderLastName',
    'action',
    'status',
    'transactionIds',
    'authOnly',
    'unsettledOnly',
    'creditDebitOnly'
  ]);

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/transactions?' + qs.stringify(query),
    method: 'GET'
  }, next);
};

/**
 * Get a single transaction at a business.
 * @param {String} options.businessId
 * @param {String} options.transactionId
 * @return {Transaction} transaction
 */
module.exports.getTransaction = function getTransaction(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'transactionId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/transactions/' + encodeURIComponent(options.transactionId),
    method: 'GET'
  }, next);
};
