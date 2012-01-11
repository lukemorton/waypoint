Route = require('./route').Route

unless Array.isArray
  Array.isArray = (obj) ->
    Object.prototype.toString.call(obj) is '[object Array]'

class Router
  constructor: (config) ->
    if config
      for key in ['routes', 'baseUri', 'notFound']
        @[key] = config[key] if config[key]?

      @routeMap(config.routeMap)  if config.routeMap?

  baseUri: ''
  routes: []

  route: (method, uri, callback) ->
    if method instanceof Route
      route = method
    else
      route = new Route(method, uri, callback)
    @routes.push route
  
  routeMap: (map, baseUri = @baseUri) ->
    for uri, callback of map
      [uri, method] = parseMethodUri(uri)
      uri = baseUri+uri

      if typeof callback is 'function' or Array.isArray(callback)
        @route(method, uri, callback)
      else if typeof callback is 'object'
        @routeMap(callback, uri)
      else
        throw 'Map must be string array or object'

  dispatch: (method, uri) ->
    for route in @routes
      matches = route.match(method, uri)
      unless matches
        continue

      if Array.isArray(route.callback)
        callbacks = route.callback
      else
        callbacks = [route.callback]

      for c in callbacks
        c.apply(route, matches)

      return true
    false

parseMethodUri = (uri) ->
  matches = uri.match(/^(GET|POST) (.+)/)
  method = matches[1] if matches and matches[1]
  uri = matches[2] if matches and matches[2]
  [uri, method]

exports.Router = Router