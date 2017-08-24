# Poynt Node.js SDK

This SDK helps you connect to the Poynt API, get/create business information, and send cloud messages to your terminal app.

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
