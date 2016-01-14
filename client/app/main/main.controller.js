'use strict';

(function() {

class MainController {
/* @ngInject */
  constructor($http, $scope,thing,Modal,socket,logger) {
    this.$http = $http;
    this.awesomeThings = [];

    var vm = this;
    vm.favoriteThings = [];
    vm.otherThings = [];
    vm.createThing = createThing;

    function createThing() {
      Modal
        .open('sm', 'create-thing.html', 'CreateThingCtrl')
        .then(function(result){
          logger.info('create thing result: ', result);
          vm.favoriteThings.push(result);
        }, function(error) {});
    }


    function _things(isFavorite,params) {
      thing
        .getThings(isFavorite,params)
        .then(response => {
          logger.info('thing list: ', response.data);
          if(isFavorite) {
            vm.favoriteThings = response.data;
          } else {
            vm.otherThings = response.data;
          }
        })
    }

    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });

    $scope.$watch(function() {
      return vm.myThingName;
    }, function(newVal, oldVal) {
      _things(true, {name: vm.myThingName});
    });

    $scope.$watch(function() {
      return vm.otherThingName;
    }, function(newVal, oldVal) {
      _things(false, {name: vm.otherThingName});
    });
  }


  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.favoriteThings.unshift(result);
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

angular.module('angularFullstackApp')
  .controller('MainController', MainController);

})();
