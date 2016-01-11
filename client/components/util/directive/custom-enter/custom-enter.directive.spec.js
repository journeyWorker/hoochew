'use strict';

describe('Directive: customEnter', function () {

  // load the directive's module
  beforeEach(module('angularFullstackApp'));
  var template = '<input type="text" custom-enter="search()">';
  var element, parentScope, elementScope;


  var compileDirective = function(template) {
    inject(function($compile) {
      element = angular.element(template);
      element = $compile(element)(parentScope);
      parentScope.$digest();
      elementScope = element.scope();
    });
  };

  beforeEach(inject(function($rootScope) {
    parentScope = $rootScope.$new();

  }));

  it('should call callback function when the event happens', function() {
      compileDirective(template);
      spyOn(elementScope, "$apply");
      var ke1 = $.Event('keydown');
      ke1.keyCode = ke1.which = 13; // Enter
      $(element).trigger(ke1);
      expect(elementScope.$apply).toHaveBeenCalled();
  });
});
