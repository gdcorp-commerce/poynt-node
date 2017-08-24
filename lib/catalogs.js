/**
 * @file Catalog APIs
 */

var helpers = require('./helpers');
var qs      = require('querystring');

/**
 * Get a list of catalogs
 * @param {String} options.businessId
 * @param {String} options.startAt (optional)
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional)
 * @param {Integer} options.limit (optional)
 * @return {CatalogList} catalogs
 */
module.exports.getCatalogs = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']);
  if (hasErr) { return next(hasErr); }

  var query = helpers.getKeys(options, [
    'startAt',
    'startOffset',
    'endAt',
    'limit'
  ]);

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs?' + qs.stringify(query),
    method : 'GET'
  }, next);
};

/**
 * Get a single catalog for a business.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @return {Catalog} catalog
 */
module.exports.getCatalog = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId),
    method : 'GET'
  }, next);
};

/**
 * Get a catalog by id with all product details info embedded in the Catalog.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @return {Catalog} catalog
 */
module.exports.getFullCatalog = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId) + '/full',
    method : 'GET'
  }, next);
};

/**
 * Get a single category in a catalog for a business.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @param {String} options.categoryId
 * @return {Category} category
 */
module.exports.getCategory = function (options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId', 'categoryId']);
  if (hasErr) { return next(hasErr); }

  this.request({
    url    : '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId) + '/categories/' + encodeURIComponent(options.categoryId),
    method : 'GET'
  }, next);
};
