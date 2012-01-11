// Waypoint: Browser Edition
// Written by Luke Morton, MIT licensed.
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

  require['./route'] = new function () {
  var exports = this;
  (function() {
  var Route, paramifyString, regifyString;

  Route = (function() {

    function Route(config) {
      if (config.uri != null) this.regex = config.uri;
      if (!(this.regex instanceof RegExp)) {
        this.regex = regifyString(this.regex, {});
      }
      if (config.method != null) this.method = config.method.toUpperCase();
      this.method || (this.method = 'GET');
      if (config.callback != null) this.callback = config.callback;
    }

    Route.prototype.match = function(request) {
      var matches;
      if ((request.method != null) && this.method !== request.method.toUpperCase()) {
        return false;
      }
      matches = this.regex.exec(request.uri);
      if (matches && (matches.length != null)) return matches.slice(1);
      return false;
    };

    return Route;

  })();

  paramifyString = function(str, params, mod) {
    var param, _i, _len;
    mod = str;
    for (_i = 0, _len = params.length; _i < _len; _i++) {
      param = params[_i];
      if (params.hasOwnProperty(param)) {
        mod = params[param](str);
        if (mod !== str) break;
      }
    }
    if (mod === str) {
      return '([a-zA-Z0-9-]+)';
    } else {
      return mod;
    }
  };

  regifyString = function(str, params) {
    var capture, captures, _i, _len;
    if (str.indexOf('*' !== -1)) {
      str = str.replace(/\*/g, '([_\.\(\)!\\ %@&a-zA-Z0-9-]+)');
    }
    captures = str.match(/:([^\/]+)/ig);
    if (captures) {
      for (_i = 0, _len = captures.length; _i < _len; _i++) {
        capture = captures[_i];
        str = str.replace(capture, paramifyString(capture, params));
      }
    }
    return new RegExp("^" + str + "$");
  };

  Route.get = function(uri, callback) {
    return new Route({
      uri: uri,
      method: 'GET',
      callback: callback
    });
  };

  Route.post = function(uri, callback) {
    return new Route({
      uri: uri,
      method: 'POST',
      callback: callback
    });
  };

  exports.Route = Route;

}).call(this);

};
require['./router'] = new function () {
  var exports = this;
  (function() {
  var Route, Router, parseMethodUri;

  Route = require('./route').Route;

  if (!Array.isArray) {
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  Router = (function() {

    function Router(config) {
      if (config && (config.routes != null)) this.routes(config.routes);
    }

    Router.prototype._routes = [];

    Router.prototype.routes = function(routes) {
      if (routes != null) this._routes = routes;
      return this._routes;
    };

    Router.prototype.route = function(route) {
      if (!(route instanceof Route)) route = new Route(route);
      return this._routes.push(route);
    };

    Router.prototype.routeMap = function(map, rootUri) {
      var callback, method, uri, _ref, _results;
      if (rootUri == null) rootUri = '';
      _results = [];
      for (uri in map) {
        callback = map[uri];
        _ref = parseMethodUri(uri), uri = _ref[0], method = _ref[1];
        uri = rootUri + uri;
        if (typeof callback === 'function' || Array.isArray(callback)) {
          _results.push(this.route({
            uri: uri,
            method: method,
            callback: callback
          }));
        } else if (typeof callback === 'object') {
          _results.push(this.routeMap(callback, uri));
        } else {
          throw 'Map must be string array or object';
        }
      }
      return _results;
    };

    Router.prototype.dispatch = function(request) {
      var c, callbacks, matches, route, _i, _j, _len, _len2, _ref;
      if (typeof request === 'string') {
        request = {
          uri: request,
          method: 'get'
        };
      }
      _ref = this.routes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        matches = route.match(request);
        if (!matches) continue;
        if (Array.isArray(route.callback)) {
          callbacks = route.callback;
        } else {
          callbacks = [route.callback];
        }
        for (_j = 0, _len2 = callbacks.length; _j < _len2; _j++) {
          c = callbacks[_j];
          c.apply(route, matches);
        }
        true;
      }
      return false;
    };

    return Router;

  })();

  parseMethodUri = function(uri) {
    var matches, method;
    matches = uri.match(/^(GET|POST) (.+)/);
    if (matches && matches[1]) method = matches[1];
    if (matches && matches[2]) uri = matches[2];
    return [uri, method];
  };

  exports.Router = Router;

}).call(this);

};


  return {
    'Route' : require('./route').Route,
    'Router' : require('./router').Router,
  };
});