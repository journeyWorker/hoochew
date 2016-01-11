'use strict';

angular.module('angularFullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('webgl', {
        url: '/webgl',
        templateUrl: 'app/webgl/webgl.html',
        controller: 'WebglCtrl'
      });
  });
