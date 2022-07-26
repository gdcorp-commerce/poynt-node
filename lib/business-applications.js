/**
 * @file Business Application API's
 */

var helpers = require('./helpers');

/**
 * Get Application info
 * @param {String} options.businessId
 * @return {ApplicationInfo} Application info
 */
module.exports.getBusinessApplication = function getBusinessApplication(
  options,
  next
) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url:
        '/api/services/businesses/' +
        encodeURIComponent(options.businessId) +
        '/payfac-application/',
      method: 'GET',
      app: 'WEB',
    },
    next
  );
};

/**
 * Get Account information
 * @param {String} options.businessId
 * @return {Account} Account
 */
module.exports.getBusinessApplicationAccount = function getBusinessApplicationAccount(options, next) {
  var hasErr = helpers.hasKeys(options, [
    'businessId',
  ]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url:
        '/api/services/businesses/' +
        encodeURIComponent(options.businessId) +
        '/payfac-application/account',
      method: 'GET',
      app: 'WEB',
    },
    next
  );
};

/**
 * Get Orders information
 * @param {String} options.businessId
 * @return {Array} List of orders
 */
module.exports.getBusinessApplicationOrders = function getBusinessApplicationOrders(
  options,
  next
) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url:
        '/api/services/businesses/' +
        encodeURIComponent(options.businessId) +
        '/payfac-application/orders',
      method: 'GET',
      app: 'WEB',
    },
    next
  );
};

/**
 * Get Application status
 * @param {String} options.businessId
 * @return {Account} Account
 */
module.exports.getBusinessApplicationStatus = function getBusinessApplicationStatus(
  options,
  next
) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }
  this.request(
    {
      url:
        '/api/services/businesses/' +
        encodeURIComponent(options.businessId) +
        '/payfac-application/status',
      method: 'GET',
      app: 'WEB',
    },
    next
  );
};

/**
 * Get Business profile
 * @param {String} options.businessId
 * @return {PayfacProfile} PayfacProfile
 */
module.exports.getBusinessApplicationProfile = function getBusinessApplicationProfile(
  options,
  next
) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }
  this.request(
    {
      url:
        '/api/services/businesses/' +
        encodeURIComponent(options.businessId) +
        '/payfac-application/profile',
      method: 'GET',
      app: 'WEB',
    },
    next
  );
};
