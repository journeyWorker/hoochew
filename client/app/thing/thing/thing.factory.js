'use strict';

angular.module('angularFullstackApp')
  .factory('things', function (Restangular) {
    var model = Restangular.all('thing');

    model.one = function(id) {
      return Restangular.one('thing', id);
    };
    // Public API here
    return model;
  });
