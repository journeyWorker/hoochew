'use strict';

angular.module('angularFullstackApp')
  .directive('webgl', function () {
    return {
      controller: 'WebglCtrl',
      templateUrl: 'components/webgl/webgl.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
