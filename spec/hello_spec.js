describe('test', function() {

    beforeEach(function() {
        console.log('before >>>');
    });

    afterEach(function() {
        console.log("<<< after");
    });

    it('test1', function() {
        console.log("  test1");
    });

    it('test2', function() {
        console.log("  test2");
    });
});