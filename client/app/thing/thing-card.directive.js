/**
 * Created by itmnext13 on 2016. 1. 12..
 */
(function() {
  'use strict';

  angular
    .module('angularFullstackApp')
    .directive('thingCard', thingCard);

  /* @ngInject */
  function thingCard() {
    return {
      restrict: 'EA',
      scope: {
        thing: '=info'
      },
      template: '<div class="col-lg-3 col-md-3 col-sm-4 col-xs-6">' +
      '<div class="panel panel-default">' +
      '<div class="panel-heading">' +
      '<h3 class="panel-title"><i class="fa fa-users"></i> {{thing.name}}</h3>' +
      '</div>' +
      '<div class="panel-body">' +
      '<p class="group_card_desc" ng-style="descriptionFont">{{thing.info}}</p> ' +
      '</div>' +
      '</div>' +
      '</div>',
      link: link
    };
    function link(scope, element, attrs) {
      scope.descriptionFont = {
        'color': 'yellow',
        'text-shadow': '0 0 8px #000',
        '-moz-text-shadow': '0 0 8px #000',
        '-webkit-text-shadow': '0 0 8px #000'
      };
    }
  }

})();