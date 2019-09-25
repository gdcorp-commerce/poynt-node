/**
 * @file Order APIs
 */

var helpers = require('./helpers');
var qs = require('querystring');

/**
 * Get reports at a business.
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.deviceId (optional)
 * @param {Boolean} options.latest (optional)
 * @param {String} options.timezone (optional)
 * @param {Number} options.page (optional)
 * @param {Number} options.limit (optional)
 * @param {String} options.reportType (optional)
 * @param {String} options.userId {optional}
 * @param {String} options.includingDate - report range overlaps with date
 * @return {ReportList} reports
 */
module.exports.getReports = function getReports(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, [
    'storeId',
    'deviceId',
    'latest',
    'timezone',
    'page',
    'limit',
    'reportType',
    'userId',
    'includingDate'
  ]);

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/reports?' + qs.stringify(query),
    method: 'GET',
    app: 'WEB'
  }, next);
};

/**
 * Creates a report at a business.
 * @param {String} options.type - Report type
 * @param {String} options.start - Start date
 * @param {String} options.end - End date
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.tid
 * @param {String} options.employeeId
 * @param {String} options.employeeName
 * @param {String} options.includingDate - report range overlaps with date
 * @return {Report} report
 */
module.exports.createReport = function createReport(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'type', 'start', 'end']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/reports',
    method: 'POST',
    body: options,
    app: 'WEB'
  }, next);
};
