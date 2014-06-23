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
      // punctuation: '.',
      // separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return parseFile(filepath);
      });
      // .join(grunt.util.normalizelf(options.separator));

      // Handle options.
      // src += options.punctuation;

      // Write the destination file.
      grunt.log.writeln('written: ' + src);
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });

    function parseFile(filepath) {

      var languages = {};
      var compiled = {};

      var context = 'none';
      var lines = grunt.file.read(filepath).split('\n');
      for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        var line = lines[lineIndex];
        grunt.log.writeln(line);

        if (isValueLine(line)) {
          var splitterIndex = line.indexOf(':');
          var code = line.substring(0, splitterIndex).replace(new RegExp('\t', 'g'), '');
          var value = line.substring(splitterIndex + 1);
          if(context === 'LANGUAGES') {
            languages[''+code] = value; 
          } else {
            var prop = languages[''+code] + '.' + context;
            assign(compiled, prop, value);
          }
        } else if (languages.length === 0 && line.indexOf('LANGUAGES') === 0) {
          context = 'LANGUAGES';
          grunt.log.writeln('context changed to '+ context);
        } else if (line.length !== 0) {
          if (line.indexOf("\t") === 0) {
            var idention = line.split('\t').length - 1;
            var actualDots = context.split('.').length - 1;
            if(idention <= actualDots) {
              context = context.split('.').slice(0, idention).join('.');
            }
            grunt.log.writeln('idention '+ idention);
            context += '.' + line.replace(new RegExp('\t', 'g'), '').replace(new RegExp(' ', 'g'), '');
          } else {
            context = line.replace(new RegExp(' ', 'g'), '');
          }
          grunt.log.writeln('context changed to '+ context);
        }
      }

      return JSON.stringify(compiled);

    }

    function isValueLine(line) {
      var firstChar = line.replace(new RegExp('\t', 'g'), '').substring(0, 1);
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

  });

};