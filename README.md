# grunt-translate-compile

> A pre-compiler for angular-translate based on TL: a simple write-less markup specially designed for angular-translate.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-translate-compile --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-translate-compile');
```

## Translation Markup - TL

The translation markup intends to drastically reduce the amount of typing needed to translate your app, by keeping it simpler and improving it's maintenance.
To learn more about the TL markup, [please refer to the full documentation](http://angular-translate.github.io/translate-compile).

Briefing: A translation file begins with the declaration of all supported languages of your application. A custom numeric code (key) must be assigned to each one of the declared languages. In the sample that comes next, we're saying that [american english code is 1], [brazilian portuguese is 2] and [spanish from spain is 3]. Translation values are assigned directly to the language key.

Here goes a sample TL markup code:

```js
LANGUAGES
  1:enUs
  2:ptBr
  3:esEs

MENU
  USER
    LABEL
      1:User
      2:Usuário
      3:Usuario
    DROPDOWN
      EDIT
        1:Edit
        2,3:Editar
      LOGOUT
        1:Logout
        2:Sair
        3:Finalizar la Sesión
  CART
    EMPTY
      1:Empty Cart
      2:Esvaziar Carrinho
      3:Vaciar Carrito
    CHECKOUT
      1:Checkout
      2:Fechar Pedido
      3:Realizar Pedido
```

Compiling the above will result the bellow:

```js
var angTranslations = {
  "enUs": {
    "MENU": {
      "USER": {
        "LABEL": "User",
        "DROPDOWN": {
          "EDIT": "Edit",
          "LOGOUT": "Logout"
        }
      },
      "CART": {
        "EMPTY": "Empty Cart",
        "CHECKOUT": "Checkout"
      }
    }
  },
  "ptBr": {
    "MENU": {
      "USER": {
        "LABEL": "Usuário",
        "DROPDOWN": {
          "EDIT": "Editar",
          "LOGOUT": "Sair"
        }
      },
      "CART": {
        "EMPTY": "Esvaziar Carrinho",
        "CHECKOUT": "Fechar Pedido"
      }
    }
  },
  "esEs": {
    "MENU": {
      "USER": {
        "LABEL": "Usuario",
        "DROPDOWN": {
          "EDIT": "Editar",
          "LOGOUT": "Finalizar la Sesión"
        }
      },
      "CART": {
        "EMPTY": "Vaciar Carrito",
        "CHECKOUT": "Realizar Pedido"
      }
    }
  }
};
```
Notice how the writing was significantly reduced as it's no longer needed to rewrite every key for each language, we are also skipping blocks and quotes. Thus we can focus on what really matters, the translations. Maintenance is also greatly improved, as adding a new key will no longer be a hunt for the right spot of each language.
Equal translations are also single written as multiple language keys may be assigned to a value (checkout 'user.dropdown.edit' key).

**Please refer to the [full documentation](http://angular-translate.github.io/translate-compile) for more examples and capabilities.**


## The "translate_compile" task

### Overview

#### 1. Add the task
In your project's Gruntfile, add a section named `translate_compile` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  translate_compile: {
    compile: {
      options: {
        // task-specific options go here. refer to options topic
      },
      files: {
        // post-compiling file to the left, pre-compiling files to the right
        'compiled-translations.js': ['translations/*.tl']
      }
    }
  }
});
```
#### 2. Let your server know about it
Remember to include "translate_compile" inside your server task so the compilation takes place when you start it (connect/express). Something like:

```js
grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'clean:server',
      'translate_compile:compile', // <-- here it is
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });
```

#### 3. Watch it
For a better experience, watch for any changes made to your translation files (requires [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)). Something like:
```js
watch: {
  tl: {
    files: ['translations/*.tl'],
    tasks: ['translate_compile:compile'],
    options: {
      livereload: true
    }
  }
},
```

#### 4. Take it to your build
Add the "translate_compile" to your build task. Something like:
```js
grunt.registerTask('build', [
    'clean:dist'
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'translate_compile:compile', // <-- here it is
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);
```

#### You should now be good to go!

### Options

#### options.translationVar
Type: `String`
Default value: `'angTranslations'`

Determines the name of the compiled variable. Ex: `var angTranslations = {"usEn":{...}}`

#### options.multipleObjects
Type: `Boolean`
Default value: `false`

If `multipleObjects` is set to `true` there will no longer be only one root variable like `angTranslations`. Translations will now be splitted into one object per language. Ex: `var enUs = {...}; var ptBr = {...}; var esEs = {...};` Variable names will the ones declared in the `LANGUAGES` section.

#### options.asJson
Type: `Boolean`
Default value: `false`

Should this value be set to true there will be no variable assignment inside the file, only the resulting json will be there.

#### options.filePerLang
Type: `Boolean`
Default value: `false`

If this values is set to `true` the translations will be split into separate files for each language.

Place `{lang}` in the destination file name when using this option:
```javascript
files: {
  'compiled_translation_{lang}.json': ['translations/*.tl']
}
```
`{lang}` will be replaced by the corresponding language id for the file. For example if you have translations with language keys
`"en-Us"` and `"pt-Br"` and the above file template, the following files will be generated:
```
compiled_translation_en-Us.json
compiled_translation_pt-Br.json
```

#### options.moduleExports
Type: `Boolean`
Default value: `false`

Use with `options.asJson` for generate a Nodejs module or `options.multipleObjects` to generate a file divided in different modules per language.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
