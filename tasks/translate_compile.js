/*
 * grunt-translate-compile
 * https://github.com/caina/translate-compile
 *
 * Copyright (c) 2014 Cainã Santos
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('translate_compile', 'The best Grunt plugin ever.', function() {
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      translationVar: 'angTranslations'
    });

    // avaiable contexts
    var c = {
      NONE: 'NONE',
      LANGUAGES: 'LANGUAGES'
    };

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var translations = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join('\n');

      // Compile translation markup to json
      var compiled = compile(translations);

      // Handle options.
      compiled = 'var ' + options.translationVar + ' = ' + compiled;

      // Write the destination file.
      grunt.file.write(f.dest, compiled);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });

    function compile(translations) {

      var languages = {}; // declared languages
      var compiled = {}; // future compiled object

      var context = c.NONE; // actual context, will vary upon line read

      var lines = tlCompatible(translations).split('\n'); // get file lines

      for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) { // iterate over lines

        var line = lines[lineIndex]; // currunt line
        if(line.replaceAll('\t', '').beginsWith(' ')) {
          grunt.fail.warn('Please use only tabs for indentation!');
        }

        if (isValueLine(line)) { // go in if it is a translation line (begins with a number)

          var splitterIndex = line.indexOf(':');
          var key = line.substring(0, splitterIndex).replaceAll('\t', ''); // get language key
          var value = line.substring(splitterIndex + 1); // get value for key

          if(context === c.LANGUAGES) {
            // stores new declared language
            languages[key] = value; 
          } else {
            if(!languages[key]) {
              grunt.fail.warn('No languages were declared!');
            }
            // compile translation (value) for language (key)
            var prop = languages[key] + '.' + context;
            assign(compiled, prop, value);
          }

        } else if (languages.length === 0 && line.beginsWith('LANGUAGES')) {

          // sets language declaration context
          context = c.LANGUAGES;

        } else if (line.length !== 0) {
          // stores translation key
          if (line.beginsWith('\t')) {
            // treats tabs indentation
            var indentation = line.split('\t').length - 1;
            var actualDots = context.split('.').length - 1;
            if(indentation <= actualDots) {
              context = context.split('.').slice(0, indentation).join('.');
            }
            // stores translation sub-key
            context += '.' + line.replaceAll('\t', '').replaceAll(' ', '');
          } else {
            // stores translation root-key
            context = line.replaceAll(' ', '');
          }

        }

      }

      return JSON.stringify(compiled); // returns json version of the compiled object

    }

    function isValueLine(line) {
      var firstChar = line.replaceAll('\t', '').substring(0, 1);
      return !isNaN(parseFloat(firstChar)) && isFinite(firstChar);
    }

    function assign(obj, prop, value) {
        if (typeof prop === "string") {
            prop = prop.split(".");
        }
        if (prop.length > 1) {
            var e = prop.shift();
            assign(obj[e] = Object.prototype.toString.call(obj[e]) === "[object Object]" ? obj[e] : {}, prop, value);
        } else {
            obj[prop[0]] = value;
        }
    }

    function tlCompatible(string) {
      if(string.contains('\r\n')) {
        // ensure compatible line break
        string = string.replaceAll('\r\n', '\n');
      }
      return string;
    }

  });

};