'use strict';

/* @ngInject */
angular.module('angularFullstackApp')
  .service('thing', function (things,Auth) {

    this.getThing = getThing;
    this.getThings = getThings;
    this.create = create;

    function getThing(thingId) {
      return things.one(thingId).get();
    }

    function getThings(isFavoriteThing, params) {
      var thing;
      if(isFavoriteThing) {
        thing = {type: 'FAVORITE', sort: '-CREATED'};
      } else {
        thing = {type: 'GENERAL', sort: '-CREATED'};
      }
      if(params) {
        params = angular.extend(thing,params);
      } else {
        params = thing;
      }
      return things.customGET('',params);
    }

    function create(params) {
      return things.customPOST(params);
    }
  });
