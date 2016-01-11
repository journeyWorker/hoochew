'use strict';

describe('Directive: webgl', function () {

  // load the directive's module and view
  beforeEach(module('angularFullstackApp'));
  beforeEach(module('components/webgl/webgl.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<webgl></webgl>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the webgl directive');
  }));
});
