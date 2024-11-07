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
 * @param {Object} options
 * @param {String} options.token - the payment token
 * @param {String} options.nonce - the payment nonce (one-time usage)
 * @param {Boolean} options.tokenize - whether to create token or not
 * @param {String} options.businessId - the business ID
 * @param {String} options.storeId - the store ID (optional)
 * @param {String} options.deviceId - the device ID (optional)
 * @param {String} options.channelId - the channel ID (optional)
 * @param {String} options.sourceApp - the source app (optional)
 * @param {String} options.source - the source of transaction, can be INSTORE, WEB, MOBILE, CALLIN, CATALOG (optional)
 * @param {String} options.action - the purchase action. can be SALE or AUTHORIZE
 * @param {Boolean} options.authOnly - whether to make it an authOnly transaction
 * @param {Object} options.amounts – amounts object containing currency, transactionAmount, orderAmount, cashbackAmount, tipAmount
 *   Note: transactionAmount = orderAmount + tipAmount + cashbackAmount
 * @param {String} options.currency – the currency (optional)
 * @param {Boolean} options.emailReceipt – whether to email receipt or not (optional)
 * @param {String} options.receiptEmailAddress – email to send receipt to (optional)
 * @param {Array} options.references - transaction references (optional)
 * @param {String} options.customerPresenceStatus – customer presence status – defaults to ECOMMERCE
 * @param {String} options.entryMode – entry mode (optional) – defaults to KEYED
 * @param {String} options.fundingSourceType – funding source type (optional) e.g. CREDIT_DEBIT, CHEQUE - defaults to CREDIT_DEBIT
 * @param {String} options.cvv – cvv verification (optional)
 * @param {String} options.zip – zip verification (optional)
 * @param {String} options.address.line1 – address verification line1 (optional)
 * @param {String} options.address.line2 – address verification line2 (optional)
 * @param {String} options.address.city – address verification city (optional)
 * @param {String} options.address.territory – address verification territory (optional)
 * @param {String} options.address.countryCode – address verification country code (optional)
 * @param {String} options.address.postalCode – address verification postal code (optional)
 * @param {String} options.phone.ituCountryCode – phone country code (optional). defaults to 1
 * @param {String} options.phone.areaCode – phone area code (optional)
 * @param {String} options.phone.localPhoneNumber – phone number (optional)
 * @param {String} options.partialAuthEnabled - whether partial auth is enabled (optional). Defaults to false
 * @param {String} options.requestId idempotency id. Retries should always attach request id
 */
module.exports.chargeToken = function (options, next) {
  var hasErr =
    helpers.hasKeys(options, ["businessId", "action", "amounts"]) ||
    helpers.hasKeys(options.amounts, ["transactionAmount", "orderAmount"]);
  if (hasErr) {
    return next(hasErr);
  }

  var amounts = {
    cashbackAmount: options.amounts.cashbackAmount || 0,
    currency: options.currency || "USD",
    orderAmount: options.amounts.orderAmount,
    tipAmount: options.amounts.tipAmount || 0,
    transactionAmount: options.amounts.transactionAmount,
  };

  // request body
  var body = {
    action: options.action,
    context: {
      businessId: options.businessId,
    },
    amounts: amounts,
  };

  if (options.authOnly) {
    options.action = "AUTHORIZE";
    body.authOnly = true;
  }

  // choose funding source
  if (options.token) {
    body.fundingSource = {
      cardToken: options.token,
    };
  } else if (options.nonce) {
    body.fundingSource = {
      nonce: options.nonce,
      tokenize: options.tokenize || false,
    };
  } else {
    var err = helpers.error({
      name: "InvalidArgumentError",
      message: "Invalid params: Request should contain either nonce or token",
      statusCode: 400,
    });
    return next(err);
  }

  // add customer presence
  if (!body.fundingSource.entryDetails) {
    body.fundingSource.entryDetails = {};
  }
  body.fundingSource.entryDetails.customerPresenceStatus =
    options.customerPresenceStatus || "ECOMMERCE";
  body.fundingSource.entryDetails.entryMode = options.entryMode || "KEYED";

  // add CVV, address verification data
  if (options.cvc || options.zip || options.street || options.address) {
    body.fundingSource.verificationData = {};
    if (options.cvc) {
      body.fundingSource.verificationData.cvData = options.cvc;
    }
    if (options.address) {
      body.fundingSource.verificationData.cardHolderBillingAddress =
        options.address;
    } else if (options.street) {
      if (!body.fundingSource.verificationData.cardHolderBillingAddress) {
        body.fundingSource.verificationData.cardHolderBillingAddress = {};
      }
      body.fundingSource.verificationData.cardHolderBillingAddress.line1 =
        options.street;
    }
    if (options.zip) {
      if (!body.fundingSource.verificationData.cardHolderBillingAddress) {
        body.fundingSource.verificationData.cardHolderBillingAddress = {};
      }
      body.fundingSource.verificationData.cardHolderBillingAddress.postalCode =
        options.zip;
    }
  }

  if (options.fundingSourceType) {
    body.fundingSource.type = options.fundingSourceType;
  }

  // fill in other params
  if (options.storeId) {
    body.context.storeId = options.storeId;
  }
  if (options.channelId) {
    body.context.channelId = options.channelId;
  }
  if (options.deviceId) {
    body.context.storeDeviceId = options.deviceId;
  }
  if (options.sourceApp) {
    body.context.sourceApp = options.sourceApp;
  }
  if (options.source) {
    body.context.source = options.source;
  }
  if (options.emailReceipt) {
    body.emailReceipt = options.emailReceipt;
  }
  if (options.receiptEmailAddress) {
    body.receiptEmailAddress = options.receiptEmailAddress;
  }
  if (options.references) {
    body.references = options.references;
  }
  body.partialAuthEnabled = options.partialAuthEnabled || false;
  if (options.phone) {
    body.receiptPhone = {
      type: options.phone.type || "MOBILE",
      areaCode: options.phone.areaCode,
      ituCountryCode: options.phone.ituCountryCode || "1",
      localPhoneNumber: options.phone.localPhoneNumber,
    };
  }

  this.request(
    {
      url: `/businesses/${options.businessId}/cards/tokenize/charge`,
      method: "POST",
      body: body,
      requestId: options.requestId,
    },
    next
  );
};

module.exports.charge = module.exports.chargeToken;
