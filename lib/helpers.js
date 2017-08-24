/**
 * @file Poynt API request helper methods
 */

var debug       = require('debug')('poynt');
var Jwt         = require('jsonwebtoken');
var makeRequest = require('request');
var uuid        = require('uuid');

/**
 * (Private) Gets the URL of Poynt API based on env
 * @param {String} env
 */
var getPoyntURL = function getPoyntURL(env) {
  if (env === 'dev') {
    return 'https://services-dev.poynt.net';
  } else if (env === 'ci') {
    return 'https://services-ci.poynt.net';
  } else {
    return 'https://services.poynt.net';
  }
};

/**
 * Returns a new JavaScript error object based on args
 * @param {String} options.name
 */
module.exports.error = function (options) {
  if (options instanceof Error) { return options; }

  var e = new Error(options.message || options.name || 'Something went wrong');
  e.name = (options.message ? options.name : null) || 'Error';
  e.statusCode = options.statusCode || options.httpStatus || 400;
  if (options.developerMessage) { e.developerMessage = options.developerMessage; }
  if (options.requestId) { e.requestId = options.requestId; }

  return e;
};

/**
 * Checks whether all necessary keys in an object are present, if not return
 * an error.
 * @param {Object} options - The thing to check
 * @param {[String]} keys - The array of keys needed to be present.
 * @returns null if all present, returns error object if has missing
 */
module.exports.hasKeys = function (options, keys) {
  options = options || {};
  keys = keys || [];

  var missing = [];
  keys.forEach(function (key) {
    if (key in options && options[key] !== undefined) {
      // do nothing
    } else {
      missing.push(key);
    }
  });

  if (missing.length) {
    return module.exports.error({
      name       : 'InvalidArgumentError',
      message    : 'Missing params: ' + missing.join(', '),
      statusCode : 400
    });
  } else {
    return null;
  }
};

/**
 * Extracts keys from an object, only if they exist, and returns a new object.
 * @param {Object} source - the object to extract from
 * @param {String[]} keys - an array of keys to get
 */
module.exports.getKeys = function getKeys(source, keys) {
  var object = {};

  (keys || []).forEach(function (key) {
    if (typeof source[key] !== 'undefined') {
      object[key] = source[key];
    }
  });

  return object;
};

/**
 * Make a request to API service without error protection.
 * @param {String} options.method
 * @param {String} options.url
 * @param {Object} options.body (optional) - request body
 * @param {String} options.env (optional) - Poynt environment to use (production or dev). Defaults to production
 * @param {String} options.applicationId (optional) - application id
 * @param {String} options.requestId (optional) - request UUID
 * @param {Object} options.headers (optional) - request headers
 * @param {Integer} options.timeout (optional) - timeout in milliseconds
 */
module.exports.nakedRequest = function nakedRequest(options, next) {
  var hasErr = module.exports.hasKeys(options, ['url', 'method']);
  if (hasErr) { return next(hasErr); }

  if (!next) { next = function () {}; }

  // set request headers
  var requestId = options.requestId || uuid.v4();
  var headers = {};
  if (options.headers) {
    Object.keys(options.headers).forEach(function (key) {
      headers[key] = options.headers[key];
    });
  }
  headers['Poynt-Request-Id'] = requestId;
  headers['User-Agent'] = 'nodejs-sdk' + (options.applicationId ? '-' + options.applicationId : '');
  headers['Api-Version'] = '1.2';
  if (options.accessToken) {
    headers.Authorization = 'Bearer ' + options.accessToken;
  }

  // build request data object
  var data = {
    url                : getPoyntURL(options.env) + options.url,
    method             : options.method,
    headers            : headers,
    rejectUnauthorized : false,
    timeout            : options.timeout || 30000,
    time               : true,
    agent              : false,
    pool               : false,
  };

  // if body type is form-url-encoded or json (default)
  if (options.form) {
    data.form = options.body;
  } else {
    data.json = options.body || true;
  }

  debug('Poynt API request:', JSON.stringify(data));

  return makeRequest(data, function (err, res, body) {
    if (!res) { res = { statusCode: 500 }; }

    debug('Poynt API response:', res.statusCode, JSON.stringify(body));

    // parse response
    if (typeof body === 'string' && options.form) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return next(module.exports.error(body));
      }
    }

    // request succeeded
    if (res.statusCode < 300) {
      return next(null, body);
    }

    var requestErr = body || {};
    requestErr.requestId = requestId;
    if (!requestErr.httpStatus) { requestErr.httpStatus = res.statusCode; }

    // api request error
    next(module.exports.error(err || requestErr));
  });
};

/**
 * Authenticates to API service using a JWT.
 * @param {String} options.applicationId - application id
 * @param {String} options.key - application private key
 * @param {String} options.env - Poynt environment to use (production or dev). Defaults to production
 */
module.exports.authenticate = function authenticate(options, next) {
  var hasErr = module.exports.hasKeys(options, ['applicationId', 'key']);
  if (hasErr) { return next(hasErr); }

  var jwt = Jwt.sign({
    aud : [getPoyntURL(options.env)],
    iss : options.applicationId,
    sub : options.applicationId,
    iat : new Date().getTime(),
    jti : uuid.v4(),
    exp : new Date().getTime() + 1000 * 60 * 60 * 24 * 365
  }, options.key, { algorithm: 'RS256' });

  var data = {
    url           : '/token',
    method        : 'POST',
    form          : true,
    env           : options.env,
    applicationId : options.applicationId,
    body          : {
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }
  };

  module.exports.nakedRequest(data, next);
};
