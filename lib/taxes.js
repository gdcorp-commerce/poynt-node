/**
 * @file Tax APIs
 */

var helpers = require('./helpers');
var qs      = require('querystring');

/**
 * Get a list of taxes
 * @param {String} options.businessId
 * @param {String} options.startAt (optional)
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional)
 * @param {Integer} options.limit (optional)
 * @return {TaxList} taxes
 */
module.exports.getTaxes = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) { return next(hasErr); }

  var query = helpers.getKeys(options, [
    'startAt',
    'startOffset',
    'endAt',
    'limit'
  ]);

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/taxes?' + qs.stringify(query),
    method : 'GET'
  }, next);
};

/**
 * Get a single tax for a business.
 * @param {String} options.businessId
 * @param {String} options.taxId
 * @return {Tax} tax
 */
module.exports.getTax = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'taxId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/taxes/' + encodeURIComponent(options.taxId),
    method : 'GET'
  }, next);
};
