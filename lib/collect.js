/**
 * @file Poynt Collect APIs
 */

var helpers = require("./helpers");

/**
 * Exchanges a nonce for a payment token
 * @param {String} options.businessId - the business ID
 * @param {String} options.nonce - the nonce
 */
module.exports.tokenizeCard = function (options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "nonce"]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/cards/tokenize`,
      method: "POST",
      body: {
        nonce: options.nonce,
      },
    },
    next
  );
};
