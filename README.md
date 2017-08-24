# Poynt Node.js SDK

This SDK helps you connect to the Poynt API, get/create business information, and send cloud messages to your terminal app.

## Documentation

Check out our [API reference](https://poynt.com/docs/api/) or our [developer guides](https://poynt.com/tag/guides/)!

## Installation

Install this package:

```
npm install poynt --save
```

## Usage

You can connect to the Poynt API by passing either a filename or a string containing your PEM-encoded private key you downloaded from Poynt.net.

```javascript
var poynt = require('poynt')({
  filename: __dirname + '/key.pem'
});
```
or

```javascript
var poynt = require('poynt')({
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

## Namespaces and methods

### [Businesses](https://poynt.com/docs/api/#businesses-index)

* `getBusiness`

### Stores

### [Orders](https://poynt.com/docs/api/#orders-index)

* `getOrders`
* `getOrder`

### [Transactions](https://poynt.com/docs/api/#transactions-index)

* `getTransactions`
* `getTransaction`

### [Business Users](https://poynt.com/docs/api/#business-users-index)

* `getBusinessUsers`
* `getBusinessUser`

### [Customers](https://poynt.com/docs/api/#customers-index)

* `getCustomers`
* `getCustomer`

### Webhooks
