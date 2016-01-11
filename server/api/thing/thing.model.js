'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import * as common from '../../components/utilities/common.js';
import {Schema} from 'mongoose';

var _ = require('lodash');

var FollowerSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  role: {
    type: String,
    enum: ['OWNER', 'MEMBER', 'GUEST']
  }
}, {
  toJSON: {
    transform: function(doc, ret) {
      var follower = ret.follower;
      delete ret._id;
      delete ret.follower;
      ret.id = follower.id;
      ret.email = follower.email;
      ret.name = follower.name;
      return ret;
    }
  }
});

var ThingSchema = new Schema({
  name: String,
  info: String,
  created_at: {
    type: Date,
    index: true
  },
  deleted_at: {
    type: Date,
    index: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  followers: [FollowerSchema]
}, {
  toJSON: {
    virtuals: true,
    getters: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret._id;
      if (doc.populated('owner')) {
        delete ret.owner.info;
        delete ret.owner.created_at;
        delete ret.owner.thing;
        ret.owner.role = 'OWNER';
      } else {
        delete ret.owner;
      }
      if (doc.populated('followers.follower')) {
        ret.followers = _.sortBy(ret.followers, common.sortByRole);
        ret.follower_count = ret.followers.length;
      } else {
        ret.follower_count = ret.followers.length;
        delete ret.followers;
      }

      return ret;
    }
  }
});

export default mongoose.model('Thing', ThingSchema);
