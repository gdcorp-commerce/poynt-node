/**
 * @file Business APIs
 */

var helpers = require('./helpers');

/**
 * Gets a business by ID.
 * @param {String} options.businessId
 * @return {Business} business
 */
module.exports.getBusiness = function getBusiness(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId),
    method : 'GET'
  }, next);
};
