/**
 * Created by itmnext13 on 2016. 1. 12..
 */
(function() {
  'use sctrict';

  angular
    .module('angularFullstackApp')
    .controller('CreateThingCtrl', CreateThingCtrl);

  /* @ngInject */
  function CreateThingCtrl($scope, $modalInstance, thing) {
    $scope.create = create;
    $scope.cancel = cancel;
    _init();

    function _init() {
      $scope.thing = {
        name: '',
        description: ''
      };
    }

    function create() {
      thing
        .create($scope.thing)
        .then(function(response) {
          $modalInstance.close(response.data);
        }, function(error) {
        });
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }

})();