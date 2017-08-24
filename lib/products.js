/**
 * @file Product APIs
 */

var helpers = require('./helpers');
var qs      = require('querystring');

/**
 * Get a list of products
 * @param {String} options.businessId
 * @param {String} options.startAt (optional)
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional)
 * @param {Integer} options.limit (optional)
 * @return {ProductList} products
 */
module.exports.getProducts = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) { return next(hasErr); }

  var query = helpers.getKeys(options, [
    'startAt',
    'startOffset',
    'endAt',
    'limit'
  ]);

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/products?' + qs.stringify(query),
    method : 'GET'
  }, next);
};

/**
 * Get a list of products by ID.
 * @param {String} options.businessId
 * @param {String[]} options.ids
 * @return {ProductList} products
 */
module.exports.lookupProducts = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'ids']);
  if (hasErr) { return next(hasErr); }

  var query = helpers.getKeys(options, ['ids']);

  this.pagedRequest({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/products/lookup?' + qs.stringify(query),
    method : 'GET',
    key    : 'products'
  }, next);
};

/**
 * Get a single product for a business.
 * @param {String} options.businessId
 * @param {String} options.productId
 * @return {Product} product
 */
module.exports.getProduct = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'productId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/products/' + encodeURIComponent(options.productId),
    method : 'GET'
  }, next);
};
