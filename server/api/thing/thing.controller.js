/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Thing from './thing.model';
import ThingService from './thing.service';
import errors from '../../components/errors/error';


exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

 function getFollower(type, user) {
  switch (type) {
    case 'FAVORITE':
      return {
        id: user,
        inverse: false
      };
    case 'GENERAL':
      return {
        id: user,
        inverse: true
      };
    case 'ALL':
    case undefined:
      return {};
    default:
      throw new errors.ParamInvalidError('type');
  }
}

function getSort(sort) {
  switch (sort) {
    case 'CREATED':
      return {
        by: 'created_at',
        desc: false
      };
    case '-CREATED':
    case undefined:
      return {
        by: 'created_at',
        desc: true
      };
    default:
      throw new errors.ParamInvalidError('sort');
  }
}


// Get list of thing
function index(req, res, next) {
  var follower = getFollower(req.query.type, req.user.id); //req.login.id);
  var sort = getSort(req.query.sort);
  var options = {
    name: req.query.name,
    follower: {
      id: follower.id,
      inverse: follower.inverse
    },
    sort: {
      by: sort.by,
      desc: sort.desc,
      lt: req.query.lt,
      lte: req.query.lte,
      gt: req.query.gt,
      gte: req.query.gte
    },
    limit: req.query.limit
  };

  ThingService
    .index(options)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  ThingService.show(req.params.id)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Thing in the DB
export function create(req, res) {
  ThingService.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ThingService.update(req.params.id)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  ThingService.destroy(req.params.id)
    .catch(handleError(res));
}

// follower auto enroll
exports.followers = {
  enroll: function (req, res, next) {
    ThingService.followers
      .enroll(req.thing, req.user)
      .then(respondWithResult(res))
      .catch(handleError(res));
  },
  leave: function(req, res, next) {
    ThingService.followers
      .leave(req.thing, req.user)
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
};
