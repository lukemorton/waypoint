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
