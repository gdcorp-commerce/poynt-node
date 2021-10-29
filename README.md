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
var poynt = require("poynt")({
  // region: 'eu',
  applicationId: "urn:aid:your-application-id",
  filename: __dirname + "/key.pem",
});
```

or

```javascript
var poynt = require("poynt")({
  applicationId: "urn:aid:your-application-id",
  key: "-----BEGIN RSA PRIVATE KEY-----\n.....\n-----END RSA PRIVATE KEY-----",
});
```

Then, make a request signed with your app private key:

```javascript
poynt.getBusiness(
  {
    businessId: "00000000-0000-0000-0000-000000000000",
  },
  function (err, business) {
    if (err) {
      // deal with your error
    } else {
      // do something with business
    }
  }
);
```

We'll handle all the request signing, token refresh, etc. for you!

## Namespaces and methods

### [Poynt Collect](https://docs.poynt.com/app-integration/poynt-collect/)

- `tokenizeCard`
- `charge`

### [CloudMessages](https://poynt.com/docs/api/#cloudmessages-index)

- `sendCloudMessage`
- `sendRawCloudMessage`
- `sendPaymentBridgeMessage`

### [Hooks](https://poynt.com/docs/api/#hooks-index)

- `getHooks`
- `createHook`
- `getHook`
- `deleteHook`

### [Businesses](https://poynt.com/docs/api/#businesses-index)

- `getBusiness`
- `getBusinessByDeviceId`

### [Stores](https://poynt.com/docs/api/#stores-index)

- `getStore`

### [Orders](https://poynt.com/docs/api/#orders-index)

- `getOrders`
- `getOrder`

### [Transactions](https://poynt.com/docs/api/#transactions-index)

- `getTransactions`
- `getTransaction`
- `voidTransaction`
- `refundTransaction`

### [Customers](https://poynt.com/docs/api/#customers-index)

- `getCustomers`
- `getCustomer`

### [Catalogs](https://poynt.com/docs/api/#catalogs-index)

- `getCatalogs`
- `getCatalog`
- `getFullCatalog`
- `createCatalog`
- `createFullCatalog`
- `updateCatalog`
- `deleteCatalog`
- `getCategory`
- `createCategory`
- `lookupCategories`
- `deleteCategory`
- `updateCategory`

### Invoices

- `getInvoices`
- `getInvoice`
- `createInvoice`
- `sendInvoiceReminder`
- `cancelInvoice`

### [Products](https://poynt.com/docs/api/#products-index)

- `getProducts`
- `getProductsSummary`
- `lookupProducts`
- `getProduct`
- `createProduct`
- `deleteProduct`
- `updateProduct`

### Reports

- `getReports`
- `createReport`

### [Taxes](https://poynt.com/docs/api/#taxes-index)

- `getTaxes`
- `getTax`
- `createTax`
- `deleteTax`
- `updateTax`

### [Business Users](https://poynt.com/docs/api/#business-users-index)

- `getBusinessUsers`
- `getBusinessUser`

### Business Applications

- `getBusinessApplication`
- `getBusinessApplicationStatus`
- `getBusinessApplicationAccount`
- `getBusinessApplicationOrders`
- `getBusinessApplicationProfile`

## Examples

### Charging a token from [Poynt Collect V2](https://sellbot.co/collect)

The most basic use case is just entering an amount and charging:

```
poynt.charge(
  {
    action: "SALE",
    amounts: {
      currency: "USD",
      transactionAmount: 500,
      orderAmount: 500,
    },
    businessId: "84fa5bf5-bd51-4653-80de-ce46348f7659",
    token: "...token...",
  },
  function (err, transaction) {
    if (err) {
      // deal with your error
      console.log(err);
    } else {
      // do something with transaction
      console.log(transaction);
    }
  }
);
```

Many other fields are accepted – including address, phone, and references. The following code makes a charge, fetches the full transaction, and then voids it.

```
poynt.charge(
  {
    action: "SALE",
    address: {
      line1: "858 University Ave",
      line2: "",
      city: "Palo Alto",
      territory: "CA",
      countryCode: "US",
      postalCode: "94301",
    },
    amounts: {
      currency: "USD",
      transactionAmount: 500,
      orderAmount: 500,
    },
    businessId: "84fa5bf5-bd51-4653-80de-ce46348f7659",
    emailReceipt: true,
    phone: {
      ituCountryCode: "1",
      areaCode: "234",
      localPhoneNumber: "5678901",
    },
    receiptEmailAddress: "charles@example.com",
    references: [
      {
        customType: "WEBSITE_ID",
        id: "123456",
        type: "CUSTOM",
      },
      {
        customType: "CHANNEL_ORDER_ID",
        id: "abcdef",
        type: "CUSTOM",
      },
    ],
    sourceApp: "Online Store",
    token: "...token...",
  },
  function (err, transaction) {
    if (err) {
      // deal with your error
      return console.log(err);
    }

    console.log("Transaction processed", JSON.stringify(transaction, null, 2));

    // get the transaction
    poynt.getTransaction(
      {
        businessId: "84fa5bf5-bd51-4653-80de-ce46348f7659",
        transactionId: transaction.id,
      },
      function (err, transaction) {
        if (err) {
          // deal with your error
          return console.log(err);
        }

        console.log(
          "Transaction fetched",
          JSON.stringify(transaction, null, 2)
        );

        // void the transaction
        poynt.voidTransaction(
          {
            businessId: "84fa5bf5-bd51-4653-80de-ce46348f7659",
            transactionId: transaction.id,
          },
          function (err, voidedTransaction) {
            if (err) {
              // deal with your error
              return console.log(err);
            }

            console.log(
              "Transaction voided",
              JSON.stringify(voidedTransaction, null, 2)
            );
          }
        );
      }
    );
  }
);
```

### Apple Pay Registration

- `registerApplePayMerchant`
- `unregisterApplePayMerchant`
- `getApplePayMerchant`
- `getApplePayDomainAssociationFile`
