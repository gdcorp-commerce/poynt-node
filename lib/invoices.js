/**
 * @file Invoice APIs
 */

var helpers = require("./helpers");
var qs = require("querystring");

/**
 * Get all invoices at a business.
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String[]} options.status (optional) – PAID, NOT_PAID, CANCELLED, DRAFT
 * @param {String} options.start (optional) - the time from which to start fetching invoices
 * @param {String} options.end (optional) - the time to which to end fetching invoices
 * @param {String} options.page (optional) - Defaults to 1
 * @param {String} options.pageSize (optional) - Defaults to 25
 * @return {{ customerInvoices: Invoice[] }} invoices
 */
module.exports.getInvoices = function getInvoices(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "storeId"]);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, [
    "businessId",
    "storeId",
    "status",
    "start",
    "end",
    "page",
    "pageSize",
    "customInvoiceId",
    "customerEmail",
    "firstName",
    "lastName",
  ]);

  if (Array.isArray(query.status)) {
    query.status = query.status.join(",");
  }

  this.request(
    {
      url: "/invoicing/invoices?" + qs.stringify(query),
      method: "GET",
      app: "WEB",
    },
    next
  );
};

/**
 * Get a single invoice at a business
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.orderId
 * @return {Invoice} invoice
 */
module.exports.getInvoice = function getInvoice(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "storeId", "orderId"]);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, ["businessId", "storeId"]);

  this.request(
    {
      url: "/invoicing/invoices/" + options.orderId + "?" + qs.stringify(query),
      method: "GET",
      app: "WEB",
    },
    next
  );
};

/**
 * Creates an invoice at a business
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.firstName
 * @param {String} options.lastName (optional)
 * @param {String} options.customerEmail
 * @param {String} options.title
 * @param {String} options.message
 * @param {String} options.customInvoiceId (optional)
 * @param {String} options.dueAt
 * @param {String} options.executeAt (optional) – when to send the invoice, if you wish to delay it
 * @param {Number} options.order.amounts.discountTotal (optional)
 * @param {Number} options.order.amounts.feeTotal (optional)
 * @param {Number} options.order.amounts.taxTotal (optional)
 * @param {Number} options.order.amounts.subTotal (optional)
 * @param {Number} options.order.amounts.netTotal
 * @param {Number} options.order.amounts.currency
 * @param {String} options.order.items[].name
 * @param {String} options.order.items[].sku
 * @param {Number} options.order.items[].quantity
 * @param {Number} options.order.items[].unitPrice
 * @return {Invoice} invoice
 */
module.exports.createInvoice = function createInvoice(options, next) {
  var hasErr =
    helpers.hasKeys(options, [
      "businessId",
      "storeId",
      "firstName",
      "customerEmail",
      "title",
      "message",
      "dueAt",
      "order",
    ]) ||
    helpers.hasKeys(options.order, ["amounts"]) ||
    helpers.hasKeys(options.order.amounts, ["netTotal", "currency"]);
  if (hasErr) {
    return next(hasErr);
  }

  var body = JSON.parse(JSON.stringify(options));

  if (!body.type) {
    body.type = "INVOICE";
  }
  if (!body.lastName) {
    body.lastName = "";
  }
  if (!body.allowTips) {
    body.allowTips = false;
  }

  if (!body.order.orderNumber) {
    body.order.orderNumber = 1;
  }

  if (!body.order.amounts.discountTotal) {
    body.order.amounts.discountTotal = 0;
  }
  if (!body.order.amounts.feeTotal) {
    body.order.amounts.feeTotal = 0;
  }
  if (!body.order.amounts.taxTotal) {
    body.order.amounts.taxTotal = 0;
  }
  if (!body.order.amounts.subTotal) {
    body.order.amounts.subTotal = body.order.amounts.netTotal;
  }

  if (!body.order.context) {
    body.order.context = {};
  }
  if (!body.order.context.transactionInstruction) {
    body.order.context.transactionInstruction = "NONE";
  }
  if (!body.order.context.source) {
    body.order.context.source = "WEB";
  }
  if (!body.order.context.sourceApp) {
    body.order.context.sourceApp = this._applicationId;
  }

  if (!body.order.items) {
    body.order.items = [];
  }
  if (!body.order.items.length) {
    body.order.items.push({
      name: body.order.title,
      quantity: 1,
      unitPrice: body.order.amounts.subTotal,
    });
  }
  body.order.items.forEach(function (item) {
    if (!item.sku) {
      item.sku = item.name;
    }
    if (!item.status) {
      item.status = "FULFILLED";
    }
    if (!item.unitOfMeasure) {
      item.unitOfMeasure = "EACH";
    }
    if (!item.discount) {
      item.discount = 0;
    }
    if (!item.fee) {
      item.fee = 0;
    }
    if (!item.tax) {
      item.tax = 0;
    }
    if (!item.taxExempted) {
      item.taxExempted = false;
    }
  });

  if (!body.order.statuses) {
    body.order.statuses = {};
  }
  if (!body.order.statuses.fulfillmentStatus) {
    body.order.statuses.fulfillmentStatus = "FULFILLED";
  }
  if (!body.order.statuses.status) {
    body.order.statuses.status = "OPENED";
  }
  if (!body.order.statuses.transactionStatusSummary) {
    body.order.statuses.transactionStatusSummary = "PENDING";
  }

  this.request(
    {
      url: "/invoicing/invoices",
      method: "POST",
      body: body,
      app: "WEB",
    },
    next
  );
};

/**
 * Sends a reminder for a single invoice at a business
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.orderId
 * @return {Invoice} invoice
 */
module.exports.sendInvoiceReminder = function sendInvoiceReminder(
  options,
  next
) {
  var hasErr = helpers.hasKeys(options, ["businessId", "storeId", "orderId"]);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, ["businessId", "storeId"]);

  this.request(
    {
      url: "/invoicing/invoices/" + options.orderId + "/reminder",
      body: {
        businessId: options.businessId,
        storeId: options.storeId,
      },
      method: "POST",
      app: "WEB",
    },
    next
  );
};

/**
 * Cancels an invoice for a business.
 * @param {String} options.businessId
 * @param {String} options.storeId
 * @param {String} options.orderId
 * @return {Invoice} invoice
 */
module.exports.cancelInvoice = function cancelInvoice(options, next) {
  var hasErr = helpers.hasKeys(options, ["businessId", "storeId", "orderId"]);
  if (hasErr) {
    return next(hasErr);
  }

  var query = helpers.getKeys(options, ["businessId", "storeId"]);

  this.request(
    {
      url: "/invoicing/invoices/" + options.orderId + "?" + qs.stringify(query),
      method: "DELETE",
      app: "WEB",
    },
    next
  );
};
