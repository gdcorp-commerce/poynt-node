/**
 * @file Store APIs
 */

var helpers = require('./helpers');

/**
 * Gets a store by ID.
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @return {Store} store
 */
module.exports.getStore = function getStore(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'storeId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/stores/' + encodeURIComponent(options.storeId),
    method: 'GET'
  }, next);
};
