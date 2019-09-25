/**
 * @file Catalog APIs
 */

var ff = require('ff');
var helpers = require('./helpers');
var qs = require('querystring');

/**
 * Get a list of catalogs
 * @param {String} options.businessId
 * @param {String} options.startAt (optional)
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional)
 * @param {Integer} options.limit (optional)
 * @return {CatalogList} catalogs
 */
module.exports.getCatalogs = function getCatalogs(options, next) {
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
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs?' + qs.stringify(query),
    method: 'GET'
  }, next);
};

/**
 * Get a single catalog for a business.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @return {Catalog} catalog
 */
module.exports.getCatalog = function getCatalog(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId),
    method: 'GET'
  }, next);
};

/**
 * Get a catalog by id with all product details info embedded in the Catalog.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @return {Catalog} catalog
 */
module.exports.getFullCatalog = function getFullCatalog(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId) +
      '/full',
    method: 'GET'
  }, next);
};

/**
 * Creates a catalog for a business.
 * @param {String} options.businessId
 * @param {Catalog} catalog
 * @return {Catalog} catalog
 */
module.exports.createCatalog = function createCatalog(options, catalog, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']) ||
    helpers.hasKeys(catalog, ['name']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs',
    method: 'POST',
    body: catalog
  }, next);
};

/**
 * Creates a catalog for a business. This differs from createCatalog as you can
 * create products and catalogs at the same time.
 * @param {String} options.businessId
 * @param {Catalog} catalog
 * @return {Catalog} catalog
 */
module.exports.createFullCatalog = function createFullCatalog(options, catalog, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']) ||
    helpers.hasKeys(catalog, ['name']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/full',
    method: 'POST',
    body: catalog
  }, next);
};

/**
 * Updates a catalog by ID. Can either specify the whole catalog, or an array
 * of JSON Patch instructions.
 * @param {String} options.businessId - the business ID
 * @param {String} options.catalogId - the catalog ID
 * @param {Boolean} options.noRemove - don't remove any keys from old catalog in
 *                                     the patch. safer this way. defaults to true
 * @param {Object} catalogOrPatch - if is an array, will treat as JSON patch;
 *                                  if object, will treat as catalog
 * @return {Catalog} catalog
 */
module.exports.updateCatalog = function updateCatalog(options, catalogOrPatch, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId']);
  if (hasErr) {
    return next(hasErr);
  }

  var patch;
  var self = this;

  var f = ff(function () {
    if (Array.isArray(catalogOrPatch)) {
      // if catalogOrPatch is an array, then just save it to patch
      patch = catalogOrPatch;
    } else {
      // otherwise, get patch instructions
      self.getCatalog({
        businessId: options.businessId,
        catalogId: options.catalogId,
      }, f.slot());
    }

  }, function (oldCatalog) {
    if (patch) {
      return;
    }

    if (!oldCatalog) {
      return next(helpers.error('NotFoundError', 'Old catalog not found', 404));
    }

    patch = helpers.patch(oldCatalog, catalogOrPatch, {
      noRemove: typeof options.noRemove !== 'undefined' ? options.noRemove : true
    });

  }, function () {
    self.request({
      url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(
        options.catalogId),
      method: 'PATCH',
      body: patch
    }, f.slot());

  }).onComplete(next);
};

/**
 * Deletes a single catalog for a business.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 */
module.exports.deleteCatalog = function deleteCatalog(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId),
    method: 'DELETE'
  }, next);
};

/**
 * Get a single category in a catalog for a business.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @param {String} options.categoryId
 * @return {Category} category
 */
module.exports.getCategory = function getCategory(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId', 'categoryId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId) +
      '/categories/' + encodeURIComponent(options.categoryId),
    method: 'GET'
  }, next);
};

/**
 * Creates a category on a catalog for a business.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @param {Category} category
 * @return {Category} category
 */
module.exports.createCategory = function createCategory(options, category, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId']) ||
    helpers.hasKeys(category, ['name', 'shortCode']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId) +
      '/categories',
    method: 'POST',
    body: category
  }, next);
};

/**
 * Gets multiple categories on a catalog by IDs.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @param {String[]} options.ids
 * @return {Category[]} categories
 */
module.exports.lookupCategories = function lookupCategories(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId', 'ids']);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, [
    'ids'
  ]);

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId) +
      '/categories/lookup?' + qs.stringify(query),
    method: 'GET'
  }, next);
};

/**
 * Deletes a category by ID.
 * @param {String} options.businessId
 * @param {String} options.catalogId
 * @param {String} options.categoryId
 * @return {Category} category
 */
module.exports.deleteCategory = function deleteCategory(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId', 'categoryId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' + encodeURIComponent(options.catalogId) +
      '/categories/' + encodeURIComponent(options.categoryId),
    method: 'DELETE'
  }, next);
};

/**
 * Updates a category by ID. Can either specify the whole category, or an array
 * of JSON Patch instructions.
 * @param {String} options.businessId - the business ID
 * @param {String} options.catalogId - the catalog ID
 * @param {String} options.categoryId - the category ID
 * @param {Boolean} options.noRemove - don't remove any keys from old category in
 *                                     the patch. safer this way. defaults to true
 * @param {Object} categoryOrPatch - if is an array, will treat as JSON patch;
 *                                   if object, will treat as category
 * @return {Category} category
 */
module.exports.updateCategory = function updateCategory(options, categoryOrPatch, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'catalogId', 'categoryId']);
  if (hasErr) {
    return next(hasErr);
  }

  var patch;
  var self = this;

  var f = ff(function () {
    if (Array.isArray(categoryOrPatch)) {
      // if categoryOrPatch is an array, then just save it to patch
      patch = categoryOrPatch;
    } else {
      // otherwise, get patch instructions
      self.getCategory({
        businessId: options.businessId,
        catalogId: options.catalogId,
        categoryId: options.categoryId,
      }, f.slot());
    }

  }, function (oldCategory) {
    if (patch) {
      return;
    }

    if (!oldCategory) {
      return next(helpers.error('NotFoundError', 'Old category not found', 404));
    }

    patch = helpers.patch(oldCategory, categoryOrPatch, {
      noRemove: typeof options.noRemove !== 'undefined' ? options.noRemove : true
    });

  }, function () {
    self.request({
      url: '/businesses/' + encodeURIComponent(options.businessId) + '/catalogs/' +
        encodeURIComponent(options.catalogId) + '/categories/' + encodeURIComponent(options.categoryId),
      method: 'PATCH',
      body: patch
    }, f.slot());

  }).onComplete(next);
};
