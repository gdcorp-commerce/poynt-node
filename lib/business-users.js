/**
 * @file Business APIs
 */

var helpers = require('./helpers');

/**
 * Get all users at a business.
 * @param {String} options.businessId
 * @return {BusinessUser[]} businessusers
 */
module.exports.getBusinessUsers = function getBusinessUsers(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/businessUsers',
    method : 'GET'
  }, next);
};

/**
 * Get a single user at a business.
 * @param {String} options.businessId
 * @param {String} options.businessUserId
 * @return {BusinessUser} businessuser
 */
module.exports.getBusinessUser = function getBusinessUser(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'businessUserId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/businessUsers/' + encodeURIComponent(options.businessUserId),
    method : 'GET'
  }, next);
};
