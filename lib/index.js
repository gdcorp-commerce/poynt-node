/**
 * @file Poynt Node.js SDK class.
 */

var ff      = require('ff');
var fs      = require('fs');
var helpers = require('./helpers');
var Jwt     = require('jsonwebtoken');

/**
 * (Private) Checks to see if access token is expired.
 * @param {String} options.accessToken
 */
var accessTokenIsExpired = function accessTokenIsExpired(options) {
  if (!options.accessToken) { return true; }
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
var Poynt = function (options) {
  var hasErr = helpers.hasKeys(options, ['applicationId']);
  if (hasErr) { throw hasErr; }

  if (options.filename) {
    this._key = fs.readFileSync(options.filename, 'utf-8');
  } else if (options.key) {
    this._key = options.key;
  } else {
    throw new Error('Key not defined');
  }

  this._applicationId = options.applicationId;
  this._env           = options.env || 'production';
};

/**
 * Makes a request.
 * @param {String} options.url
 * @param {String} options.method
 * @param {Object} options.body (optional)
 * @param {Integer} options.timeout (optional)
 * @param {String} options.requestId (optional)
 * @param {Object} options.headers (optional)
 * @param {Boolean} options.forceTokenRefresh (optional)
 */
Poynt.prototype.request = function (options, next) {
  if (!next) { next = function () {}; }
  var self = this;

  var body;

  var f = ff(function () {
    // if no token, token is expired, or force refresh, re-authenticate with your
    // private key
    if (!self._accessToken ||
      options.forceTokenRefresh ||
      (self._accessToken && accessTokenIsExpired({ accessToken: self._accessToken }))) {
      helpers.authenticate({
        env           : self._env,
        applicationId : self._applicationId,
        key           : self._key
      }, f.slotPlain(2));
    }

  }, function (err, token) {
    if (token && token.accessToken) {
      self._accessToken = token.accessToken;
      self._expires     = token.expires;
    }

    helpers.nakedRequest({
      url           : options.url,
      method        : options.method,
      body          : options.body,
      timeout       : options.timeout,
      requestId     : options.requestId,
      headers       : options.headers,
      env           : self._env,
      accessToken   : self._accessToken,
      applicationId : self._requestId
    }, f.slotPlain(2));

  }, function (err, doc) {
    body = doc || {};


    // request succeeded
    if (!err) { return f.succeed(); }

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
 * Attaches all methods and constants in a namespace to the Poynt prototype.
 * Adds a wrapper that ensures app is authenticated.
 * @param {Object} namespace - object with methods and constants
 */
var bootstrap = function (namespace) {
  Object.keys(namespace).forEach(function (key) {
    Poynt.prototype[key] = namespace[key];
  });
};

/**
 * Bootstrap all Poynt API namespaces.
 */
bootstrap(require('./businesses'));

/**
 * Export a nice function to create a new Poynt instance.
 */
module.exports = function (options) {
  return new Poynt(options);
};
