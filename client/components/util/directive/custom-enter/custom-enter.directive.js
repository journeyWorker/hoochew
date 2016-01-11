'use strict';
angular
  .module('angularFullstackApp')
    /* @ngInject */
  .directive('customEnter', function () {
    return function (scope, element, attrs) {
      scope.search = function() {};
        element.bind("keydown keypress", function (event) {
          if (event.which === 13) {
            scope.$apply(function () {
              scope.$eval(attrs.customEnter);
            });
            event.preventDefault();
          }
        });
    };
  });
