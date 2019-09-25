/**
 * @file Product APIs
 */

var ff = require('ff');
var helpers = require('./helpers');
var qs = require('querystring');

/**
 * Get a list of products
 * @param {String} options.businessId
 * @param {String} options.startAt (optional)
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional)
 * @param {Integer} options.limit (optional)
 * @return {ProductList} products
 */
module.exports.getProducts = function getProducts(options, next) {
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
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/products?' + qs.stringify(query),
    method: 'GET'
  }, next);
};

/**
 * Get a list of  summaries at a business. Product summaries contain product
 * shortCode, price, businessId, name, and id.
 * @param {String} options.businessId
 * @param {String} options.startAt (optional)
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional)
 * @param {Integer} options.limit (optional)
 * @return {ProductList} products
 */
module.exports.getProductsSummary = function getProductsSummary(options, next) {
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
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/products/summary?' + qs.stringify(query),
    method: 'GET'
  }, next);
};

/**
 * Get a list of products by ID.
 * @param {String} options.businessId
 * @param {String[]} options.ids
 * @return {ProductList} products
 */
module.exports.lookupProducts = function lookupProducts(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'ids']);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, ['ids']);

  this.pagedRequest({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/products/lookup?' + qs.stringify(query),
    method: 'GET',
    key: 'products'
  }, next);
};

/**
 * Get a single product for a business.
 * @param {String} options.businessId
 * @param {String} options.productId
 * @return {Product} product
 */
module.exports.getProduct = function getProduct(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'productId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/products/' + encodeURIComponent(options.productId),
    method: 'GET'
  }, next);
};

/**
 * Creates a product on a business.
 * @param {String} options.businessId
 * @param {Product} product
 * @return {Product} product
 */
module.exports.createProduct = function createProduct(options, product, next) {
  var hasErr = helpers.hasKeys(options, ['businessId']) ||
    helpers.hasKeys(product, ['name', 'shortCode', 'sku']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/products',
    method: 'POST',
    body: product
  }, next);
};

/**
 * Deactivates a product. Deactivated products will be removed from all catalog
 * references.
 * @param {String} options.businessId
 * @param {String} options.productId
 * @return {Product} product
 */
module.exports.deleteProduct = function deleteProduct(options, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'productId']);
  if (hasErr) {
    return next(hasErr);
  }

  this.request({
    url: '/businesses/' + encodeURIComponent(options.businessId) + '/products/' + encodeURIComponent(options.productId),
    method: 'DELETE'
  }, next);
};

/**
 * Updates a product by ID. Can either specify the whole product, or an array
 * of JSON Patch instructions.
 * @param {String} options.businessId - the business ID
 * @param {String} options.productId - the product ID
 * @param {Boolean} options.noRemove - don't remove any keys from old product in
 *                                     the patch. safer this way. defaults to true
 * @param {Object} productOrPatch - if is an array, will treat as JSON patch;
 *                                  if object, will treat as product
 * @return {Product} product
 */
module.exports.updateProduct = function updateProduct(options, productOrPatch, next) {
  var hasErr = helpers.hasKeys(options, ['businessId', 'productId']);
  if (hasErr) {
    return next(hasErr);
  }

  var patch;
  var self = this;

  var f = ff(function () {
    if (Array.isArray(productOrPatch)) {
      // if productOrPatch is an array, then just save it to patch
      patch = productOrPatch;
    } else {
      // otherwise, get patch instructions
      self.getProduct({
        businessId: options.businessId,
        productId: options.productId,
      }, f.slot());
    }

  }, function (oldProduct) {
    if (patch) {
      return;
    }

    if (!oldProduct) {
      return next(helpers.error('NotFoundError', 'Old product not found', 404));
    }

    patch = helpers.patch(oldProduct, productOrPatch, {
      noRemove: typeof options.noRemove !== 'undefined' ? options.noRemove : true
    });

  }, function () {
    self.request({
      url: '/businesses/' + encodeURIComponent(options.businessId) + '/products/' + encodeURIComponent(
        options.productId),
      method: 'PATCH',
      body: patch
    }, f.slot());

  }).onComplete(next);
};
