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

/**
 * Charges a payment token
 * @param {String} options.token - the payment token
 * @param {String} options.nonce - the payment nonce (one-time usage)
 * @param {Boolean} options.tokenize - whether to create token or not
 * @param {String} options.businessId - the business ID
 * @param {String} options.storeId - the store ID (optional)
 * @param {String} options.deviceId - the device ID (optional)
 * @param {String} options.sourceApp - the source app (optional)
 * @param {String} options.action - the purchase action. can be SALE or AUTHORIZE
 * @param {Boolean} options.authOnly - whether to make it an authOnly transaction
 * @param {Object} options.amounts – amounts object containing currency, transactionAmount, orderAmount, cashbackAmount, tipAmount
 *   Note: transactionAmount = orderAmount + tipAmount + cashbackAmount
 * @param {String} options.currency – the currency (optional)
 * @param {Boolean} options.emailReceipt – whether to email receipt or not (optional)
 * @param {String} options.receiptEmailAddress – email to send receipt to
 * @param {Array} options.references - transaction references (optional)
 */
module.exports.chargeToken = function (options, next) {
  var hasErr =
    helpers.hasKeys(options, ["businessId", "action", "amounts"]) ||
    helpers.hasKeys(options.amounts, ["transactionAmount", "orderAmount"]);
  if (hasErr) {
    return next(hasErr);
  }

  if (options.authOnly) {
    options.action = "AUTHORIZE";
  }

  var amounts = {
    cashbackAmount: options.amounts.cashbackAmount || 0,
    orderAmount: options.amounts.orderAmount,
    tipAmount: options.amounts.tipAmount || 0,
    transactionAmount: options.amounts.transactionAmount,
  };
  if (options.currency) {
    amounts.currency = options.currency;
  }

  var body = {
    action: options.action,
    context: {
      businessId: options.businessId,
    },
    amounts: amounts,
  };

  // Choosing funding source
  var err;
  if (options.nonce && options.token) {
    err = helpers.error({
      name: 'InvalidArgumentError',
      message: 'Invalid params: Request should contain either nonce or token',
      statusCode: 400
    });
    return next(err);
  }

  // AX-3758: charge using nonce as funding source
  if (options.nonce) {
    body.fundingSource = {
      nonce: options.nonce,
      tokenize: options.tokenize || false,
    }
  // Poynt-collect V1 flow
  } else if (options.token) {
    body.fundingSource = {
      cardToken: options.token,
    }
  } else {
    err = helpers.error({
      name: 'InvalidArgumentError',
      message: 'Invalid params: Request should contain either nonce or token',
      statusCode: 400
    });
    return next(err);
  }
  if (options.storeId) {
    body.context.storeId = options.storeId;
  }
  if (options.deviceId) {
    body.context.storeDeviceId = options.deviceId;
  }
  if (options.sourceApp) {
    body.context.sourceApp = options.sourceApp;
  }

  if (options.emailReceipt && options.receiptEmailAddress) {
    body.emailReceipt = options.emailReceipt;
    body.receiptEmailAddress = options.receiptEmailAddress;
  }

  if (options.references) {
    body.references = options.references;
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/cards/tokenize/charge`,
      method: "POST",
      body: body,
    },
    next
  );
};

module.exports.charge = module.exports.chargeToken;