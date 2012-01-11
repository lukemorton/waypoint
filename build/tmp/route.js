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
