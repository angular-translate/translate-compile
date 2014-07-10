'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var errorMsg = 'compilation should match the expected compiled file ';
exports.translate_compile = {
  setUp: function(done) {
    done();
  },
  single_file: function(test) {
    test.expect(1);

    var compiledFile = 'test/expected/compiled-single.js';
    var actual = grunt.file.read('tmp/compiled-single.js');
    var expected = grunt.file.read(compiledFile);
    test.equal(actual, expected, errorMsg + compiledFile);

    test.done();
  },
  multiple_files: function(test) {
    test.expect(1);

    var compiledFile = 'test/expected/compiled-multi.js';
    var actual = grunt.file.read('tmp/compiled-multi.js');
    var expected = grunt.file.read(compiledFile);
    test.equal(actual, expected, errorMsg + compiledFile);

    test.done();
  },
  no_language_legend_file: function(test) {
    test.expect(1);

    var compiledFile = 'test/expected/compiled-no-lan.json';
    var actual = grunt.file.read('tmp/compiled-no-lan.json');
    var expected = grunt.file.read(compiledFile);
    test.equal(actual, expected, errorMsg + compiledFile);

    test.done();
  },
  aggregate_keys: function(test) {
    test.expect(1);

    var compiledFile = 'test/expected/compiled-aggregate-keys.js';
    var actual = grunt.file.read('tmp/compiled-aggregate-keys.js');
    var expected = grunt.file.read(compiledFile);
    test.equal(actual, expected, errorMsg + compiledFile);

    test.done();
  }
};
