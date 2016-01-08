'use strict';

describe('Service: storageService', function () {

    // load the service's module
    beforeEach(module('angularFullstackApp'));

    // instantiate service
    var storageService;
    beforeEach(inject(function (_storageService_) {
        storageService = _storageService_;
    }));

    it('should do set Value & get Value', function () {
        console.log(storageService);
        storageService.setValue('user-token', 'abcdefg123');
        expect(storageService.getValue('user-token')).toEqual('abcdefg123');
        storageService.flush();
    });

    it('should remove Value', function () {
        storageService.setValue('user-token', 'abcdefg123');
        expect(storageService.getValue('user-token')).toEqual('abcdefg123');
        storageService.removeValue('user-token');
        expect(storageService.getValue('user-token')).toEqual(null);
    });

    it('should set TTL', function () {
        storageService.setValue('user-token', 'abcdefg123');
        expect(storageService.getValue('user-token')).toEqual('abcdefg123');
        storageService.setTTL('user-token',1000);

        expect(storageService.getValue('user-token')).toEqual('abcdefg123');

        setTimeout(function () {
            expect(storageService.getValue('user-token')).toEqual(null);
            done();
        },2000);
    });
});
