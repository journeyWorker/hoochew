'use strict';

describe('Service: storageService', function () {

  // load the service's module
  beforeEach(module('angularFullstackApp'));

  // instantiate service
  var storage;
  beforeEach(inject(function (_storageService_) {
    storage = _storageService_;
  }));

  it('should do set Value & get Value', function () {
    expect(!!storage).toBe(true);
  });

});
