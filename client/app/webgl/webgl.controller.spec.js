'use strict';

describe('Controller: WebglCtrl', function () {

  // load the controller's module
  beforeEach(module('angularFullstackApp'));

  var WebglCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WebglCtrl = $controller('WebglCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
