'use strict';

angular.module('angularFullstackApp')
  .directive('webgl', function () {
    return {
      templateUrl: 'components/webgl/webgl.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
