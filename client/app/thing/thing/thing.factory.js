'use strict';

angular.module('angularFullstackApp')
  .factory('things', function (Restangular) {
    var model = Restangular.all('things');

    model.one = function(id) {
      return Restangular.one('things', id);
    };
    // Public API here
    return model;
  });
