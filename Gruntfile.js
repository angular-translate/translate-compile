/*
 * grunt-translate-compile
 * https://github.com/angular-translate/translate-compile
 *
 * Copyright (c) 2014 Cainã Santos
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    translate_compile: {
      single_file: {
        options: {},
        files: {
          'tmp/compiled-single.js': ['test/fixtures/pre-compiled-menu.tl']
        }
      },
      multiple_files: {
        options: {
          translationVar: 'tl'
        },
        files: {
          'tmp/compiled-multi.js': ['test/fixtures/pre-compiled-menu.tl', 'test/fixtures/pre-compiled-country.tl']
        }
      },
      no_language_legend_file: {
        options: {
          asJson: true
        },
        files: {
          'tmp/compiled-no-lan.json': ['test/fixtures/pre-compiled-menu.tl', 'test/fixtures/pre-compiled-us-states.tl']
        }
      },
      aggregate_keys: {
        options: {
          multipleObjects: true
        },
        files: {
          'tmp/compiled-aggregate-keys.js': ['test/fixtures/pre-compiled-country.tl', 'test/fixtures/pre-compiled-us-states.tl']
        }
      },
      file_per_language: {
        options: {
          filePerLang: true,
          asJson: true
        },
        files: {
          'tmp/compiled-multi-by-key/compiled_{lang}.json': ['test/fixtures/pre-compiled-menu.tl', 'test/fixtures/pre-compiled-us-states.tl']
        }
      },
      multi_files_with_pattern: {
        files: {
          'tmp/compiled-multi-pattern.js': ['test/fixtures/*.tl']
        }
      },
      module_exports_multiple: {
        options: {
          multipleObjects: true,
          moduleExports: true
        },
        files: {
          'tmp/compiled-module-exports-multiple.js': ['test/fixtures/*.tl']
        }
      },
      module_exports_json: {
        options: {
          asJson: true,
          moduleExports: true
        },
        files: {
          'tmp/compiled-module-exports-json.js': ['test/fixtures/*.tl']
        }
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

    watch: {
      scripts: {
        files: ['tasks/*.js', 'test/*.js'],
        tasks: ['jshint', 'test']
      },
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'translate_compile', 'nodeunit']);

  // By default, lint and run all tests, then watch any changes made inside tasks dir.
  grunt.registerTask('default', ['jshint', 'test', 'watch']);

};