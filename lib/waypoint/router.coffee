Route = require('./route')

isArray = Array.isArray
isArray or= ((obj) -> Object.prototype.toString.call(obj) is '[object Array]')    

class Router
  constructor: (config) ->
    if config
      for key in ['routes', 'baseUri', 'notFound']
        @[key] = config[key] if config[key]?

      routeMap = config.routeMap if config.routeMap?
      
    @routes  or= []
    @baseUri or= ''
    @routeMap(routeMap) if routeMap?

  route: (method, uri, callback) ->
    if method instanceof Route
      route = method
    else
      route = new Route(method, uri, callback)
    @routes.push(route)
    return @

  get : (uri, callback) -> @route('GET',  uri, callback)
  post: (uri, callback) -> @route('POST', uri, callback)

  extractUriAndMethod = (uri) ->
    matches = uri.match(/^(GET|POST) (.+)/)
    
    if matches and matches.length?
      [uri, method] = matches[1..2].reverse()
      method or= 'GET'
      return [uri, method]
    else
      return [uri or '', 'GET']
  
  routeMap: (map, baseUri = @baseUri) ->
    for uri, callback of map
      [uri, method] = extractUriAndMethod(uri)
      uri = baseUri+uri

      if typeof callback is 'function' or isArray(callback)
        @route(method, uri, callback)
      else if typeof callback is 'object'
        @routeMap(callback, uri)
      else
        throw 'Map must be string array or object'

    return @        

  dispatch: (method, uri, scope = {}) ->
    for route in @routes
      continue unless matches = route.match(method, uri)

      if isArray(route.callback) 
        callbacks = route.callback
      else
        callbacks = [route.callback]

      c.apply(scope, matches) for c in callbacks
      return true

    @notFound.call(scope) if @notFound?
    return false

module.exports = Router