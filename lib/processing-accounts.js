/**
 * @file Processing accounts APIs
 */

const helpers = require('./helpers');
const qs = require('querystring');

/**
 * @typedef ProcessingAccount
 * @property {String} accountId
 * @property {String} businessId
 * @property {String} createdAt
 * @property {String} customerId
 * @property {Boolean} mock
 * @property {String} processor
 * @property {String} organizationId
 * @property {String} projectId
 * @property {String} referralUrlId
 * @property {String} serviceId
 * @property {String} serviceType
 * @property {String} shopperId
 * @property {String} ventureId
 * @property {String} updatedAt
 * @property {Array<String>} actionsNeeded
 * @property {String} accountStatus
 * @property {String} applicationStatus
 * @property {String} bankAccount
 * @property {String} applicationLevel
 * @property {Boolean} depositsEnabled
 * @property {Boolean} paymentsEnabled
 * @property {Boolean} processorEnabled
 * @property {Boolean} refundsEnabled
 * @property {Boolean} settlementsEnabled
 * @property {String} riskDecision
 * @property {Array.<String>} riskStepUps
 */

/**
 * Get all processing accounts
 * @param {String} options.applicationId (optional) - Poynt application id
 * @param {String} options.businessId (optional) – Poynt business id
 * @param {String} options.customerId (optional)
 * @param {String} options.serviceId (optional)
 * @param {String} options.serviceType (optional)
 * @param {String} options.shopperId (optional)
 * @param {String} options.referralUrlId (optional)- GoDaddy referral URL ID
 * @param {String} options.organizationId (optional) – if specified, must match application token
 * @param {String} options.ventureId (optional)
 * @param {Number} options.page
 * @param {Number} options.size
 * @return {ProcessingAccount[]} processingAccounts
 */
module.exports.getProcessingAccounts = function getProcessingAccounts(
  options,
  next
) {
  var query = helpers.getKeys(options, [
    'applicationId',
    'businessId',
    'customerId',
    'serviceId',
    'serviceType',
    'shopperId',
    'referralUrlId',
    'organizationId',
    'ventureId',
    'page',
    'size'
  ]);

  this.request(
    {
      url: '/processing-accounts?' + qs.stringify(query),
      app: 'WEB',
      method: 'GET'
    },
    next
  );
};
