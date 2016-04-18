/**
 * Dependencies
 */
js2coffee = require('js2coffee');

/*
 * grunt-translate-compile
 * https://github.com/angular-translate/translate-compile
 *
 * Copyright (c) 2014 Cainã Santos
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('translate_compile', 'A pre-compiler for angular-translate based on TL: a simple write-less markup specially designed for angular-translate.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      translationVar: 'angTranslations',
      multipleObjects: false,
      filePerLang: false,
      asJson: false
    });

    // Avaiable compilation contexts
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

      // Compile translation markup
      var compiled = compile(translations);

      // Handle options.
      if (options.filePerLang) {
        for (var language in compiled) {
          handleFileOptions(compiled[language], f.dest.replace('{lang}', language));
        }
      } else {
        handleFileOptions(compiled, f.dest);
      }

    });

    function handleFileOptions(compiledItem, fileDest) {
      var compiled;

      if (options.asJson) {
        // no js variables printed
        if (options.moduleExports) {
          compiled = 'module.exports = ' + JSON.stringify(compiledItem) + ';';

        } else {
          compiled = JSON.stringify(compiledItem);
        }
      } else if (options.multipleObjects && !options.filePerLang) {
        // one variable per language
        var tmp = '';
        var prefix = options.moduleExports ? 'module.exports.' : 'var ';
        for (var language in compiledItem) {
          tmp += prefix + language + ' = ' + JSON.stringify(compiledItem[language]) + ';';
        }
        compiled = tmp;
      } else {
        // one root variable enclosing all languages
        if (options.moduleExports) {
          compiled = 'module.exports.' + options.translationVar + ' = ' + JSON.stringify(compiledItem) + ';';
        } else {
          compiled = 'var ' + options.translationVar + ' = ' + JSON.stringify(compiledItem) + ';';
        }

      }

      if (options.coffee) {
        compiled = js2coffee.build(compiled, {
          show_src_lineno: false,
          indent: options.indent || "  "
        });
        var _path = f.dest.split(".");
        _path[_path.length - 1] = "coffee";
        f.dest = _path.join(".");
      }
      // Write the destination file.
      grunt.file.write(fileDest, compiled);

      // Give me five!
      grunt.log.writeln('File "' + fileDest + '" created.');
    }

    function compile(translations) {

      var languages = {}; // declared languages
      var compiled = {}; // future compiled object

      var context = c.NONE; // actual context, will vary upon line read

      var lines = tlCompatible(translations).split('\n'); // get file lines

      for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) { // iterate over lines

        var line = lines[lineIndex]; // currunt line
        if (line.replaceAll('\t', '').beginsWith(' ')) {
          grunt.fail.warn('Please use only tabs for indentation! Line: ' + lineIndex);
        }

        if (isValueLine(line)) { // go in if it is a translation line (begins with a number)

          var splitterIndex = line.indexOf(':');
          var key = line.substring(0, splitterIndex).replaceAll('\t', ''); // get language key
          var value = line.substring(splitterIndex + 1); // get value for key

          if (context === c.LANGUAGES) {
            // stores new declared language
            languages[key] = value;
          } else {
            if (languages.length === 0) {
              grunt.fail.warn('No languages were declared! Line: ' + lineIndex);
            }
            var keys = key.split(','); // get and iterate over the possible multi-keys applied
            for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
              // compile and store translation for language (value for key)
              var prop = languages[keys[keyIndex].trim()] + '.' + context;
              assign(compiled, prop, value);
            }
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
            if (indentation <= actualDots) {
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

      return compiled; // returns the compiled object

    }

    function isValueLine(line) {
      // checks if the first appearing value is a number
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
      if (string.contains('\r\n')) {
        // ensure compatible line break
        string = string.replaceAll('\r\n', '\n');
      }
      return string;
    }

  });

};