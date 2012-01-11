fs = require 'fs'
{exec} = require 'child_process'
CoffeeScript = require 'coffee-script'
{parser, uglify} = require 'uglify-js'

lib = './lib'
tmp = './build/tmp'
dist = './dist'

header = """
  // Waypoint: Browser Edition
  // Written by Luke Morton, MIT licensed.
"""

getVersion = -> JSON.parse(fs.readFileSync('./package.json')).version
rmTmp = -> exec "rm -rf #{tmp}"

task 'build:browser', 'Create a browser edition of Waypoint', ->
  code = ''
  for name in ['route', 'router']
    exec "mkdir -p #{tmp}"
    exec "coffee -o #{tmp} #{lib}/waypoint/*.coffee"
    code += """
      require['./#{name}'] = new function () {
        var exports = this;
        #{fs.readFileSync "#{tmp}/#{name}.js"}
      };

    """
  rmTmp()
  
  code = """
    !function (definition) {
      if (typeof define === 'function' && define.amd) {
        define(definition);
      } else {
        this.waypoint = definition();
      }
    }(function () {
      function require(path) {
        return require[path];
      }

      #{code}

      return {
        'Route' : require('./route').Route,
        'Router' : require('./router').Router,
      };
    });
  """

  version = getVersion()
  console.log "Building Waypoint #{version}"
  
  exec "mkdir -p #{dist}"
  fs.writeFileSync "#{dist}/waypoint-#{version}.js", header + '\n' + code

  code = uglify.gen_code uglify.ast_squeeze uglify.ast_mangle parser.parse code
  fs.writeFileSync "#{dist}/waypoint-#{version}.min.js", header + '\n' + code

task 'clean', 'Delete distribution folder', ->
  exec "rm -rf #{dist}"
  rmTmp()