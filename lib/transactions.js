/**
 * @file Transaction APIs
 */

var ff = require('ff');
var qs = require("querystring");
var helpers = require("./helpers");

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
 * Get a transaction currency by transaction ID.
 * @param {String} options.businessId
 * @param {String} options.transactionId
 * @return {String} currency
 */
module.exports.getTransactionCurrency = function getTransactionCurrency(options, next) {
  this.getTransaction(options, function (err, txn) {
    if (err) {
      return next(err);
    }

    var currency = (txn && txn.amounts && txn.amounts.currency) || 'USD';

    next(null, currency);
  });
};

/**
 * Cancel a single transaction at a business.
 * @param {String} options.businessId
 * @param {String} options.transactionId
 * @param {String} options.cancelRequest (optional) specify the exact reason for the undo
 * @param {String} options.requestId (optional) idempotency id. Retries should always attach request id
 * @return {Transaction} transaction
 */
module.exports.cancelTransaction = function cancelTransaction(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "transactionId"]);
  if (hasErr) {
    return next(hasErr);
  }

  this.request(
    {
      url:
        "/businesses/" +
        encodeURIComponent(options.businessId) +
        "/transactions/cancel?transaction-id=" +
        encodeURIComponent(options.transactionId),
      method: "POST",
      body: {
        cancelRequest: options.cancelRequest
      },
      requestId: options.requestId
    },
    function (err, transaction) {
      if (err) {
        return next(err);
      }

      if (!transaction || transaction.status !== "DECLINED") {
        return next(new Error("Cancel failed"));
      }
      next(null, transaction);
    }
  );
};

/**
 * Voids a single transaction at a business.
 * @param {String} options.businessId
 * @param {String} options.transactionId
 * @param {String} options.requestId idempotency id. Retries should always attach request id
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
      requestId: options.requestId
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
 * @param {String} options.requestId idempotency id. Retries should always attach request id
 * @param {Number} options.amount (optional) – defaults to original transaction amount
 * @param {String} options.currency (optional) – defaults to original transaction currency
 * @return {Transaction} transaction
 */
module.exports.refundTransaction = function refundTransaction(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "transactionId"]);

  if (hasErr) {
    return next(hasErr);
  }

  var self = this;

  var f = ff(
    function() {
      // currency is required, if amount exists
      if (options.amount) {
        if (options.currency) {
          return f.pass(options.currency);
        }

        self.getTransactionCurrency(
          {
            businessId: options.businessId,
            transactionId: options.transactionId,
          },
          f.slot()
        );
      }
    },
    function (currency) {
      var body = {
        action: "REFUND",
        parentId: options.transactionId,
      };

      if (options.amount) {
        body.amounts = {
          transactionAmount: options.amount,
          orderAmount: options.amount,
          tipAmount: 0,
          currency: currency,
        };
      }

      self.request(
        {
          url: '/businesses/' + encodeURIComponent(options.businessId) + '/transactions',
          method: 'POST',
          body: body,
          requestId: options.requestId,
        },
        f.slot()
      );
    }
  ).onComplete(function (err, transaction) {
    if (err) {
      return next(err);
    }

    if (!transaction || transaction.status !== "REFUNDED") {
      return next(new Error("Refund failed"));
    }

    next(null, transaction);
  });
};

/**
 * Authorizes a single transaction at a business.
 * @param {String} options.businessId
 * @param {Transaction} transaction
 * @param {String} options.requestId idempotency id. Retries should always attach request id
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
      requestId: options.requestId,
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
