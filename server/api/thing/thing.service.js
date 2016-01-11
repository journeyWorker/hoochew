/**
 * Created by itmnext13 on 2016. 1. 12..
 */

'use strict';

import _ from 'lodash';
import Thing from './thing.model';

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function handleEntityNotFound() {
  return function(entity) {
    if (!entity) {
      return null;
    }
    return entity;
  };
}

// Get list of thing
export function index(options) {
  // 1) thing name 검색
  // 2) thing follower id 검색
  // 3) thing created_at 정렬
  if (!options) options = {};
  if (!options.sort) options.sort = {};
  if (!options.sort.by) options.sort.by = 'created_at';
  if (!options.limit) options.limit = 10;
  if (options.limit < 1) options.limit = 1;
  if (options.limit > 100) options.limit = 100;

  var query = Thing.findAsync();
  query.where('deleted_at').exists(false);

  if (options.name) query.where('name').equals(new RegExp(options.name, 'i'));
  if (options.follower && options.follower.id) {
    var follower = options.follower;
    query.where('followers.follower');
    //ne selects the documents where the value of the field is not equal
    if (follower.inverse) query.ne(follower.id);
    else query.equals(follower.id);
  }

  var sort = options.sort;
  query.where(sort.by);
  if (sort.lt) query.lt(sort.lt);
  if (sort.lte) query.lte(sort.lte);
  if (sort.gt) query.gt(sort.gt);
  if (sort.gte) query.gte(sort.gte);
  query.sort((sort.desc ? '-' : '') + sort.by);
  query.limit(options.limit);

  return  query.populate('owner').exec()
    .then(handleEntityNotFound());
}

// Get a single thing
export function show(id) {
  return Thing.findOne({ _id: id, deleted_at: { $exists: false } })
    .populate('owner followers.follower').exec()
    .then(handleEntityNotFound());
}

// Creates a new thing in the DB.
export function create(params, user) {
  params.owner = user.id;
  params.follwers =[{
    follower: user.id,
    role: 'OWNER'
  }];
  return Thing.createAsync(params)
  .populate('owner followers.follower').exec()
    .then(handleEntityNotFound(res));
}

// Updates an existing thing in the DB.
export function update(id, params) {
  return Thing.findByIdAsync(id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body));
}

// Deletes a thing from the DB.
export function destroy(id) {

  return Thing.findByIdAndRemoveAsync(id)
    .then(handleEntityNotFound());
}

export function preload(id) {
  return Thing.findOneAsync({ _id: id, deleted_at: { $exists: false } }).exec()
    .then(handleEntityNotFound());
}

// followers enroll/leave
exports.followers = {
  enroll: function(thing, user) {
    var auto_approval = true,
      role = 'FOLLOWER';

    return thing.update({
      $addToSet: {
        followers: {
          follower: user.id,
          role: role
        }
      }
    }).then(handleEntityNotFound());
  },
  leave: function(thing, user) {
    thing.update({
      $pull: {
        followers: {
          follower: user.id
        }
      }
    }).then(handleEntityNotFound());
  }
};