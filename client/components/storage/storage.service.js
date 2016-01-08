(function () {
    'use strict';
    angular
        .module('angularFullstackApp')
        .service('storageService', storageService);

    /* @ngInject */
    function storageService() {
        this.setValue = function (key,value,options) {
            angular.element.jStorage.set(key,value,options);
        };

        this.getValue = function (key) {
            return angular.element.jStorage.get(key);
        };

        this.removeValue = function (key) {
            angular.element.jStorage.deleteKey(key);
        };

        //ttl is milliseconds
        this.setTTL = function (key, ttl) {
            angular.element.jStorage.setTTL(key,ttl);
        }
    }
})();

