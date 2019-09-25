/**
 * @file Tax APIs
 */

var ff = require('ff');
var helpers = require('./helpers');
var qs = require('querystring');

/**
 * Get a list of taxes
 * @param {String} options.businessId
 * @param {String} options.startAt (optional)
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional)
 * @param {Integer} options.limit (optional)
 * @return {TaxList} taxes
 */
module.exports.getTaxes = function getTaxes(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, [
    'startAt',
    'startOffset',
    'endAt',
    'limit'
  ]);

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/taxes?' + qs.stringify(query),
    method: 'GET'
  }, next);
};

/**
 * Get a single tax for a business.
 * @param {String} options.businessId
 * @param {String} options.taxId
 * @return {Tax} tax
 */
module.exports.getTax = function getTax(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'taxId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/taxes/' + encodeURIComponent(options.taxId),
    method: 'GET'
  }, next);
};

/**
 * Creates a tax on a business.
 * @param {String} options.businessId
 * @param {Tax} tax
 * @return {Tax} tax
 */
module.exports.createTax = function createTax(options, tax, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']) ||
    helpers.hasKeys(tax, ['name']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/taxes',
    method: 'POST',
    body: tax
  }, next);
};

/**
 * Deactivates a tax. Deactivated taxes will be removed from all catalog
 * references.
 * @param {String} options.businessId
 * @param {String} options.taxId
 * @return {Tax} tax
 */
module.exports.deleteTax = function deleteTax(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'taxId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/taxes/' + encodeURIComponent(options.taxId),
    method: 'DELETE'
  }, next);
};

/**
 * Updates a tax by ID. Can either specify the whole tax, or an array
 * of JSON Patch instructions.
 * @param {String} options.businessId - the business ID
 * @param {String} options.taxId - the tax ID
 * @param {Boolean} options.noRemove - don't remove any keys from old tax in
 *                                     the patch. safer this way. defaults to true
 * @param {Object} taxOrPatch - if is an array, will treat as JSON patch;
 *                              if object, will treat as tax
 * @return {Tax} tax
 */
module.exports.updateTax = function updateTax(options, taxOrPatch, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'taxId']);
  if (hasErr) {
    return next(hasErr);
  }

  var patch;
  var self = this;

  var f = ff(function () {
    if (Array.isArray(taxOrPatch)) {
      // if taxOrPatch is an array, then just save it to patch
      patch = taxOrPatch;
    } else {
      // otherwise, get patch instructions
      self.getTax({
        businessId: options.businessId,
        taxId: options.taxId,
      }, f.slot());
    }

  }, function (oldTax) {
    if (patch) {
      return;
    }

    if (!oldTax) {
      return next(helpers.error('NotFoundError', 'Old tax not found', 404));
    }

    patch = helpers.patch(oldTax, taxOrPatch, {
      noRemove: typeof options.noRemove !== 'undefined' ? options.noRemove : true
    });

  }, function () {
    self.request({
      url: '/businesses/' + encodeURIComponent(options.businessId) + '/taxes/' + encodeURIComponent(options.taxId),
      method: 'PATCH',
      body: patch
    }, f.slot());

  }).onComplete(next);
};
