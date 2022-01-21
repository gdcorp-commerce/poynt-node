/**
 * @file Transaction APIs
 */

var helpers = require("./helpers");
var qs = require("querystring");

/**
 * Get all transactions that match the specified filters.
 * If no filter is specified it will fetch all transactions for the business
 * since it started.
 * @param {String} options.businessId
 * @param {String} options.startAt (optional) - the time from which to start fetching transactions
 * @param {Integer} options.startOffset (optional)
 * @param {String} options.endAt (optional) - the time at which to stop fetching transactions
 * @param {Integer} options.limit (optional) - the number of transactions to fetch
 * @param {String} options.storeId (optional) - only fetch transactions for this store
 * @param {String} options.deviceId (optional) - only fetch transactions for this device
 * @param {String} options.searchKey (optional) - instead of specifying which exact field to look at, the client can simply pass this search key and the server will look at various different fields,
 * @param {String} options.cardNumberFirst6 (optional) - limit results to transactions done by cards starting with these 6 numbers
 * @param {String} options.cardNumberLast4 (optional) - limit results to transactions done by cards ending with these 4 numbers
 * @param {Integer} options.cardExpirationMonth (optional) - limit results to transactions done by cards expiring in this month
 * @param {Integer} options.cardExpirationYear (optional) - limit results to transactions done by cards expiring in this year
 * @param {String} options.cardHolderFirstName (optional) - limit results to transactions done by cards with this card holder first name
 * @param {String} options.cardHolderLastName (optional) - limit results to transactions done by cards with this card holder last name
 * @param {String} options.action (optional) - only fetch transactions with this action
 * @param {String} options.status (optional) - only fetch transactions with this status
 * @param {String} options.transactionIds (optional) - only fetch transactions matching these ids (comma separated)
 * @param {Boolean} options.authOnly (optional) - only fetch auth only transactions
 * @param {Boolean} options.unsettledOnly (optional) - only fetch unsettled transactions
 * @param {Boolean} options.creditDebitOnly (optional) - only fetch credit/debit transactions
 * @param {String} options.timeType (optional) - switch between createdAt or updatedAt timestamp for startAt and endAt, defaults to createdAt
 * @return {TransactionList} transactions
 */
module.exports.getTransactions = function getTransactions(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId"]);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, [
    "startAt",
    "startOffset",
    "endAt",
    "limit",
    "storeId",
    "deviceId",
    "searchKey",
    "cardNumberFirst6",
    "cardNumberLast4",
    "cardExpirationMonth",
    "cardExpirationYear",
    "cardHolderFirstName",
    "cardHolderLastName",
    "action",
    "status",
    "transactionIds",
    "authOnly",
    "unsettledOnly",
    "creditDebitOnly",
    "timeType",
  ]);

  this.request(
    {
      url:
        "/businesses/" +
        encodeURIComponent(options.businessId) +
        "/transactions?" +
        qs.stringify(query),
      method: "GET",
    },
    next
  );
};

/**
 * Get a single transaction at a business.
 * @param {String} options.businessId
 * @param {String} options.transactionId
 * @return {Transaction} transaction
 */
module.exports.getTransaction = function getTransaction(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "transactionId"]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url:
        "/businesses/" +
        encodeURIComponent(options.businessId) +
        "/transactions/" +
        encodeURIComponent(options.transactionId),
      method: "GET",
    },
    next
  );
};

/**
 * Voids a single transaction at a business.
 * @param {String} options.businessId
 * @param {String} options.transactionId
 * @return {Transaction} transaction
 */
module.exports.voidTransaction = function voidTransaction(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "transactionId"]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url:
        "/businesses/" +
        encodeURIComponent(options.businessId) +
        "/transactions/" +
        encodeURIComponent(options.transactionId) +
        "/void",
      method: "POST",
    },
    function (err, transaction) {
      if (err) {
        return next(err);
      }
      if (
        !transaction ||
        (transaction.status !== "VOIDED" && transaction.status !== "DECLINED")
      ) {
        return next(new Error("Void failed"));
      }
      next(null, transaction);
    }
  );
};

/**
 * Refunds a single transaction at a business.
 * @param {String} options.businessId
 * @param {String} options.transactionId
 * @param {Number} options.amount (optional) – defaults to original transaction amount
 * @return {Transaction} transaction
 */
module.exports.refundTransaction = function refundTransaction(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "transactionId"]);
  if (hasErr) {
    return next(hasErr);
  }

  const body = {
    action: "REFUND",
    parentId: options.transactionId,
  };
  if (options.amount) {
    body.amounts = {
      transactionAmount: options.amount,
      orderAmount: options.amount,
      tipAmount: 0,
    };
  }

  this.request(
    {
      url:
        "/businesses/" +
        encodeURIComponent(options.businessId) +
        "/transactions",
      method: "POST",
      body: body,
    },
    function (err, transaction) {
      if (err) {
        return next(err);
      }
      if (!transaction || transaction.status !== "REFUNDED") {
        return next(new Error("Refund failed"));
      }
      next(null, transaction);
    }
  );
};

/**
 * Authorizes a single transaction at a business.
 * @param {String} options.businessId
 * @param {Transaction} transaction
 * @return {Transaction} transaction
 */
module.exports.createTransaction = function createTransaction(
  options,
  transaction,
  next
) {
  var hasErr = helpers.hasKeys(options, ["businessId"]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url:
        "/businesses/" +
        encodeURIComponent(options.businessId) +
        "/transactions",
      method: "POST",
      body: transaction,
    },
    function (err, transaction) {
      if (err) {
        return next(err);
      }
      if (
        !transaction ||
        (transaction.status !== "AUTHORIZED" &&
          transaction.status !== "CAPTURED")
      ) {
        return next(new Error("Authorization failed"));
      }
      next(null, transaction);
    }
  );
};
