/**
 * @file Poynt Node.js SDK class.
 */

var async = require('async');
var ff = require('ff');
var fs = require('fs');
var helpers = require('./helpers');
var Jwt = require('jsonwebtoken');

/**
 * (Private) Checks to see if access token is expired.
 * @param {String} options.accessToken
 */
var accessTokenIsExpired = function accessTokenIsExpired(options) {
  if (!options.accessToken) {
    return true;
  }
  try {
    var token = Jwt.decode(options.accessToken);
    if (token && token.exp && token.exp < (new Date().getTime() / 1000 + 60)) {
      return true;
    }
  } catch (e) {
    return true;
  }
  return false;
};

/**
 * Poynt class. Has methods for all Poynt APIs.
 */
var Poynt = function Poynt(options) {
  var hasErr = helpers.hasKeys(options, ['applicationId']);
  if (hasErr) {
    throw hasErr;
  }

  if (options.filename) {
    this._key = fs.readFileSync(options.filename, 'utf-8');
  } else if (options.key) {
    this._key = options.key;
  } else {
    throw new Error('Key not defined');
  }

  this._applicationId = options.applicationId;
  this._env = options.env || 'production';
  this._region = options.region || 'us';
};

/**
 * Makes a request.
 * @param {String} options.url
 * @param {String} options.method
 * @param {Object} options.body (optional)
 * @param {Integer} options.timeout (optional)
 * @param {String} options.requestId (optional)
 * @param {String} options.app (optional) - enum of API, WEB. defaults to API
 * @param {Object} options.headers (optional)
 * @param {Boolean} options.forceTokenRefresh (optional)
 */
Poynt.prototype.request = function request(options, next) {
  if (!next) {
    next = function () {};
  }
  var self = this;

  var body;

  var f = ff(function () {
    // if no token, token is expired, or force refresh, re-authenticate with your
    // private key
    if (!self._accessToken ||
      options.forceTokenRefresh ||
      (self._accessToken && accessTokenIsExpired({
        accessToken: self._accessToken
      }))) {
      helpers.authenticate({
        env: self._env,
        region: self._region,
        applicationId: self._applicationId,
        key: self._key
      }, f.slotPlain(2));
    }

  }, function (err, token) {
    if (token && token.accessToken) {
      self._accessToken = token.accessToken;
      self._expires = token.expires;
    }

    helpers.nakedRequest({
      url: options.url,
      method: options.method,
      body: options.body,
      timeout: options.timeout,
      requestId: options.requestId,
      headers: options.headers,
      app: options.app,
      env: self._env,
      region: self._region,
      accessToken: self._accessToken,
      applicationId: self._applicationId
    }, f.slotPlain(2));

  }, function (err, doc) {
    body = doc || {};


    // request succeeded
    if (!err) {
      return f.succeed();
    }

    // refresh token if necessary
    if (!options.forceTokenRefresh && err.statusCode === 401 && body.code === 'INVALID_ACCESS_TOKEN') {
      options.forceTokenRefresh = true;
      return f.fail('TOKEN_REFRESH');
    }

    // otherwise just fail
    f.fail(err);

  }).onSuccess(function () {
    next(null, body);

  }).onError(function (err) {
    if (err === 'TOKEN_REFRESH') {
      return module.exports.request(options, next);
    }
    next(helpers.error(err), body);
  });
};

/**
 * Makes an API request, paginating forever and following all HATEOAS links
 * @param {String} options.key - the key containing the results in the response
 * @param {String} options.dedupeKey - key to dedupe on in each result object
 * @param {String} options.sortFn - use this function to sort results
 * Plus all the params from Poynt.prototype.request above:
 * @param {String} options.url
 * @param {String} options.method
 * @param {Object} options.body (optional)
 * @param {Integer} options.timeout (optional)
 * @param {String} options.requestId (optional)
 * @param {Object} options.headers (optional)
 * @param {Boolean} options.forceTokenRefresh (optional)
 */
Poynt.prototype.pagedRequest = function pagedRequest(options, next) {
  var self = this;
  var href = options.url;
  var results = [];

  async.doWhilst(function (next) {
    options.url = href;

    self.request(options, function (err, doc) {
      if (err) {
        return next(err);
      }

      href = null;

      if (doc && doc[options.key] && doc[options.key].length) {
        results = results.concat(doc[options.key]);

        if (doc.links && doc.links.length) {
          var link = doc.links.filter(function (v) {
            return v.rel === 'next';
          })[0];
          if (link) {
            href = link.href;
          }
        }
      }

      next();
    });

  }, function () {
    return href;

  }, function (err) {
    if (err) {
      return next(helpers.error(err));
    }

    if (options.dedupeKey) {
      var resultsMap = {};
      (results || []).forEach(function (result) {
        resultsMap[result[options.dedupeKey]] = result;
      });
      results = Object.keys(resultsMap).map(function (key) {
        return resultsMap[key];
      });
    }

    if (options.sortFn) {
      results.sort(options.sortFn);
    }

    next(null, results);
  });
};

/**
 * Attaches all methods and constants in a namespace to the Poynt prototype.
 * @param {Object} namespace - object with methods and constants
 */
var bootstrap = function bootstrap(namespace) {
  Object.keys(namespace).forEach(function (key) {
    Poynt.prototype[key] = namespace[key];
  });
};

/**
 * Bootstrap all Poynt API namespaces.
 */
bootstrap(require('./business-users'));
bootstrap(require('./businesses'));
bootstrap(require('./catalogs'));
bootstrap(require('./cloud-messages'));
bootstrap(require('./customers'));
bootstrap(require('./hooks'));
bootstrap(require('./orders'));
bootstrap(require('./products'));
bootstrap(require('./reports'));
bootstrap(require('./stores'));
bootstrap(require('./taxes'));
bootstrap(require('./transactions'));

/**
 * Export a nice function to create a new Poynt instance.
 */
module.exports = function (options) {
  return new Poynt(options);
};
