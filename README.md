# Poynt Node.js SDK

This SDK helps you connect to the Poynt API from your Node.js apps. You can easily get/create business information, subscribe to webhooks, and send cloud messages to your terminal app.

## Documentation

After you've [signed up for a Poynt developer account](https://poynt.net/auth/signup/developer), check out our [API reference](https://poynt.com/docs/api/) or our [developer guides](https://poynt.com/tag/guides/)!

## Installation

Install this package:

```
npm install poynt --save
```

## Usage

You can connect to the Poynt API by passing either a filename or a string containing your PEM-encoded private key you downloaded from Poynt.net. If `region` param is not set, the SDK uses `services.poynt.net` endpoint. If you need to hit `services-eu.poynt.net`, you need to pass `region: 'eu'`.

```javascript
var poynt = require('poynt')({
  // region: 'eu',
  applicationId: 'urn:aid:your-application-id',
  filename: __dirname + '/key.pem'
});
```
or

```javascript
var poynt = require('poynt')({
  applicationId: 'urn:aid:your-application-id',
  key: '-----BEGIN RSA PRIVATE KEY-----\n.....\n-----END RSA PRIVATE KEY-----'
});
```

Then, make a request signed with your app private key:

```javascript
poynt.getBusiness({
  businessId: '00000000-0000-0000-0000-000000000000'
}, function (err, business) {
  if (err) {
    // deal with your error
  } else {
    // do something with business
  }
});
```

We'll handle all the request signing, token refresh, etc. for you!

## Namespaces and methods

### [CloudMessages](https://poynt.com/docs/api/#cloudmessages-index)

* `sendCloudMessage`
* `sendRawCloudMessage`
* `sendPaymentBridgeMessage`

### [Hooks](https://poynt.com/docs/api/#hooks-index)

* `getHooks`
* `createHook`
* `getHook`
* `deleteHook`

### [Businesses](https://poynt.com/docs/api/#businesses-index)

* `getBusiness`
* `getBusinessByDeviceId`

### [Stores](https://poynt.com/docs/api/#stores-index)

* `getStore`

### [Orders](https://poynt.com/docs/api/#orders-index)

* `getOrders`
* `getOrder`

### [Transactions](https://poynt.com/docs/api/#transactions-index)

* `getTransactions`
* `getTransaction`

### [Customers](https://poynt.com/docs/api/#customers-index)

* `getCustomers`
* `getCustomer`

### [Catalogs](https://poynt.com/docs/api/#catalogs-index)

* `getCatalogs`
* `getCatalog`
* `getFullCatalog`
* `createCatalog`
* `createFullCatalog`
* `updateCatalog`
* `deleteCatalog`
* `getCategory`
* `createCategory`
* `lookupCategories`
* `deleteCategory`
* `updateCategory`

### [Products](https://poynt.com/docs/api/#products-index)

* `getProducts`
* `getProductsSummary`
* `lookupProducts`
* `getProduct`
* `createProduct`
* `deleteProduct`
* `updateProduct`

### Reports

* `getReports`
* `createReport`

### [Taxes](https://poynt.com/docs/api/#taxes-index)

* `getTaxes`
* `getTax`
* `createTax`
* `deleteTax`
* `updateTax`

### [Business Users](https://poynt.com/docs/api/#business-users-index)

* `getBusinessUsers`
* `getBusinessUser`
