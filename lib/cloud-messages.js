/**
 * @file Cloud message APIs
 */

var helpers = require('./helpers');

/**
 * Sends a cloud message by specifying the entire message object.
 * @param {Object} message - the full cloud message object
 */
module.exports.sendRawCloudMessage = function (message, next) {
  this.request({
    url    : '/cloudMessages',
    method : 'POST',
    body   : message
  }, next);
};

/**
 * Send a message from the cloud to your application running at a Poynt terminal.
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.recipientClassName
 * @param {String} options.recipientPackageName
 * @param {String} options.deviceId
 * @param {String} options.serialNumber
 * @param {String} options.data (optional) - defaults to "{}"
 * @param {String} options.ttl (optional) - defaults to 900 seconds or 15 min
 * @param {String} options.collapseKey (optional)
 */
module.exports.sendCloudMessage = function sendCloudMessage(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'storeId', 'deviceId',
    'recipientClassName', 'recipientPackageName']);
  if (hasErr) { return next(hasErr); }

  var message = {
    businessId : options.businessId,
    storeId    : options.storeId,
    deviceId   : options.deviceId,
    ttl        : options.ttl || 900,
    data       : options.data || '{}',
    recipient  : {
      className   : options.recipientClassName,
      packageName : options.recipientPackageName
    }
  };

  if (options.serialNumber) { message.serialNum = options.serialNumber; }
  if (options.collapseKey) { message.collapseKey = options.collapseKey; }

  this.sendRawCloudMessage(message, next);
};
