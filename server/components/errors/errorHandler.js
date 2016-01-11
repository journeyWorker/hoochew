'use strict';

var status = function(err) {
  switch (err.code) {
    case 'AUTHENTICATION_REQUIRED':
    case 'AUTHENTICATION_INVALID':
    case 'TOKEN_INVALID':
    case 'TOKEN_EXPIRED':
    case 'UNAUTHORIZED':
      return 401;
    case 'NOT_SELF':
    case 'NOT_THING_OWNER':
    case 'NOT_THING_MANAGER':
    case 'NOT_THING_FOLLOWER':
    case 'NOT_RELATED_TO_THING':
    case 'ALREADY_RELATED_TO_THING':
    case 'NOT_CARD_OWNER':
    case 'NOT_ALARM_OWNER':
    case 'FORBIDDEN':
      return 403;
    case 'USER_NOT_FOUND':
    case 'THING_NOT_FOUND':
    case 'PHOTO_NOT_FOUND':
    case 'CARD_NOT_FOUND':
    case 'API_NOT_FOUND':
      return 404;
    case 'USER_DUPLICATED':
    case 'USER_MISMATCH':
    case 'PASSWORD_MISMATCH':
    case 'TOKEN_MISMATCH':
    case 'NOT_FOR_THING_OWNER':
    case 'CARD_ALREADY_RESPONDED':
    case 'CARD_ALREADY_COMPLETED':
      return 409;
    case 'REQUIRED_FIELD':
    case 'INVALID_FIELD':
    case 'REQUIRED_PHOTO':
    case 'REQUIRED_PARAM':
    case 'INVALID_PARAM':
      return 422;
    default:
      console.error(err.stack);
      return 500;
  }
};

exports = module.exports = function errorHandler() {
  /* jshint unused: false */
  return function errorHandler(err, req, res, next) {
    res.status(status(err));

    var error = { message: err.message };
    for (var prop in err) error[prop] = err[prop];
    var json = JSON.stringify({ error: error });
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
  };
};
