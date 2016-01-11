'use strict';

/* THE BASE ERROR */

function SGError(name, code, message) {
  var e = Error.call(this, message);
  e.name = name;
  e.code = code;
  return e;
}

/* AUTHENTICATION ERRORS: 401 */

function AuthenticationRequiredError(message) {
  message = message || 'No Authorization header was found.';
  return SGError.call(this, 'AuthenticationRequiredError', 'AUTHENTICATION_REQUIRED', message);
}

function AuthenticationInvalidError(message) {
  message = message || 'The given Authorization header format is bad.';
  return SGError.call(this, 'AuthenticationInvalidError', 'AUTHENTICATION_INVALID', message);
}

function TokenInvalidError(message) {
  message = message || 'The given token is not valid.';
  return SGError.call(this, 'TokenInvalidError', 'TOKEN_INVALID', message);
}

function TokenExpiredError(message) {
  message = message || 'The given token is expired.';
  return SGError.call(this, 'TokenExpiredError', 'TOKEN_EXPIRED', message);
}

/* AUTHORIZATION ERRORS: 403 */

function NotSelfError(message) {
  message = message || 'You are trying to modify other, not you.';
  return SGError.call(this, 'NotSelfError', 'NOT_SELF', message);
}

function NotPhotoOnwerError(message) {
  message = message || 'You are not the owner of this photo.';
  return SGError.call(this, 'NotPhotoOnwerError', 'NOT_PHOTO_OWNER', message);
}

function NotThingOnwerError(message) {
  message = message || 'You are not the owner of this thing.';
  return SGError.call(this, 'NotThingOnwerError', 'NOT_GROUP_OWNER', message);
}

function NotThingManagerError(message) {
  message = message || 'You are not a manager of this thing.';
  return SGError.call(this, 'NotThingManagerError', 'NOT_GROUP_MANAGER', message);
}

function NotThingFollowerError(message) {
  message = message || 'You are not a follower of this thing.';
  return SGError.call(this, 'NotThingFollowerError', 'NOT_GROUP_MEMBER', message);
}

function NotThingWannabeError(message) {
  message = message || 'You are not a wannabe of this thing.';
  return SGError.call(this, 'NotThingWannabeError', 'NOT_GROUP_WANNABE', message);
}

function NotRelatedToThingError(message) {
  message = message || 'You are not related to this thing.';
  return SGError.call(this, 'NotRelatedToThingError', 'NOT_RELATED_TO_GROUP', message);
}

function AlreadyRelatedToThingError(message) {
  message = message || 'You are already related to this thing.';
  return SGError.call(this, 'AlreadyRelatedToThingError', 'ALREADY_RELATED_TO_GROUP', message);
}

function NotForThingOwnerError(message) {
  message = message || 'You are the thing owner in this thing.';
  return SGError.call(this, 'NotForThingOwnerError', 'NOT_FOR_GROUP_OWNER', message);
}

function NotCardOnwerError(message) {
  message = message || 'You are not the owner of this card.';
  return SGError.call(this, 'NotCardOnwerError', 'NOT_CARD_OWNER', message);
}

function NotAlarmOnwerError(message) {
  message = message || 'You are not the owner of this alarm.';
  return SGError.call(this, 'NotAlarmOnwerError', 'NOT_ALARM_OWNER', message);
}

/* NOT FOUND ERRORS: 404 */

function UserNotFoundError(id, message) {
  message = message || 'User:' + id + ' is not found.';
  var e = SGError.call(this, 'UserNotFoundError', 'USER_NOT_FOUND', message);
  e.id = id;
  return e;
}

function PhotoNotFoundError(id, message) {
  message = message || 'Photo:' + id + ' is not found.';
  var e = SGError.call(this, 'PhotoNotFoundError', 'PHOTO_NOT_FOUND', message);
  e.id = id;
  return e;
}

function ThingNotFoundError(id, message) {
  message = message || 'Thing:' + id + ' is not found.';
  var e = SGError.call(this, 'ThingNotFoundError', 'GROUP_NOT_FOUND', message);
  e.id = id;
  return e;
}

function CardNotFoundError(id, message) {
  message = message || 'Card:' + id + ' is not found.';
  var e = SGError.call(this, 'CardNotFoundError', 'CARD_NOT_FOUND', message);
  e.id = id;
  return e;
}

function ApiNotFoundError(url, message) {
  message = message || 'No resource for url:' + url + ' is found.';
  var e = SGError.call(this, 'ApiNotFoundError', 'API_NOT_FOUND', message);
  e.url = url;
  return e;
}

/* CONFLICT ERRORS: 409 */

function UserDuplicatedError(email, message) {
  message = message || 'User:' + email + ' already exists.';
  var e = SGError.call(this, 'UserDuplicatedError', 'USER_DUPLICATED', message);
  e.email = email;
  return e;
}

function UserMismatchError(email, message) {
  message = message || 'User:' + email + ' is not found.';
  var e = SGError.call(this, 'UserMismatchError', 'USER_MISMATCH', message);
  e.email = email;
  return e;
}

function PasswordMismatchError(email, message) {
  message = message || 'Password for user:' + email + ' is invalid.';
  var e = SGError.call(this, 'PasswordMismatchError', 'PASSWORD_MISMATCH', message);
  e.email = email;
  return e;
}

function CardAlreadyRespondedError(id, message) {
  message = message || 'You\'ve already responded to the card:' + id + '.';
  var e = SGError.call(this, 'CardAlreadyRespondedError', 'CARD_ALREADY_RESPONDED', message);
  e.id = id;
  return e;
}

function CardAlreadyCompletedError(id, message) {
  message = message || 'Card:' + id + 'is already completed.';
  var e = SGError.call(this, 'CardAlreadyCompletedError', 'CARD_ALREADY_RESPONDED', message);
  e.id = id;
  return e;
}

/* UNPROCESSABLE ENTITY ERRORS: 422 */

function FieldRequiredError(field, message) {
  message = message || 'The field:' + field + ' is required.';
  var e = SGError.call(this, 'FieldRequiredError', 'FIELD_REQUIRED', message);
  e.field = field;
  return e;
}

function FieldInvalidError(field, message) {
  message = message || 'The field:' + field + ' is not valid.';
  var e = SGError.call(this, 'FieldInvalidError', 'FIELD_INVALID', message);
  e.field = field;
  return e;
}

function ParamRequiredError(param, message) {
  message = message || 'The param:' + param + ' is required.';
  var e = SGError.call(this, 'ParamRequiredError', 'PARAM_REQUIRED', message);
  e.param = param;
  return e;
}

function ParamInvalidError(param, message) {
  message = message || 'The param:' + param + ' is not valid.';
  var e = SGError.call(this, 'ParamInvalidError', 'PARAM_INVALID', message);
  e.param = param;
  return e;
}

function PhotoRequiredError(message) {
  message = message || 'The multipart:photo is required.';
  return SGError.call(this, 'PhotoRequiredError', 'PHOTO_REQUIRED', message);
}

module.exports = {
  AuthenticationRequiredError: AuthenticationRequiredError,
  AuthenticationInvalidError: AuthenticationInvalidError,
  TokenInvalidError: TokenInvalidError,
  TokenExpiredError: TokenExpiredError,
  NotSelfError: NotSelfError,
  NotPhotoOnwerError: NotPhotoOnwerError,
  NotThingOnwerError: NotThingOnwerError,
  NotThingManagerError: NotThingManagerError,
  NotThingFollowerError: NotThingFollowerError,
  NotThingWannabeError: NotThingWannabeError,
  NotRelatedToThingError: NotRelatedToThingError,
  AlreadyRelatedToThingError: AlreadyRelatedToThingError,
  NotForThingOwnerError: NotForThingOwnerError,
  NotCardOnwerError: NotCardOnwerError,
  NotAlarmOnwerError: NotAlarmOnwerError,
  UserNotFoundError: UserNotFoundError,
  PhotoNotFoundError: PhotoNotFoundError,
  ThingNotFoundError: ThingNotFoundError,
  CardNotFoundError: CardNotFoundError,
  ApiNotFoundError: ApiNotFoundError,
  UserDuplicatedError: UserDuplicatedError,
  UserMismatchError: UserMismatchError,
  PasswordMismatchError: PasswordMismatchError,
  CardAlreadyRespondedError: CardAlreadyRespondedError,
  CardAlreadyCompletedError: CardAlreadyCompletedError,
  FieldRequiredError: FieldRequiredError,
  FieldInvalidError: FieldInvalidError,
  ParamRequiredError: ParamRequiredError,
  ParamInvalidError: ParamInvalidError,
  PhotoRequiredError: PhotoRequiredError
};
