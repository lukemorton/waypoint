class Route
  constructor: (method, uri, callback) ->
    unless callback?
      callback = uri
      uri = method
      method = 'GET'

    @regex = regifyString(uri, {}) unless uri instanceof RegExp

    @method = method.toUpperCase()
    @callback = callback if callback?

  match: (request) ->
    return no if request.method? and @method isnt request.method.toUpperCase()
    matches = @regex.exec(request.uri)
    return matches[1..] if matches and matches.length?
    no

# Helper function for expanding "named" matches 
# (e.g. `:dog`, etc.) against the given set 
# of params:
# 
#    {
#      ':dog': function (str) { 
#        return str.replace(/:dog/, 'TARGET');
#      }
#      ...
#    }
paramifyString = (str, params, mod) ->
  mod = str

  for param in params
    if params.hasOwnProperty(param)
      mod = params[param](str)
      break if mod isnt str
  
  if mod is str then '([a-zA-Z0-9-]+)' else mod

# Helper function for expanding wildcards (*) and 
# "named" matches (:whatever)
regifyString = (str, params) ->
  if str.indexOf '*' isnt -1
    str = str.replace /\*/g, '([_\.\(\)!\\ %@&a-zA-Z0-9-]+)'
  
  captures = str.match(/:([^\/]+)/ig)
      
  if captures
    for capture in captures
      str = str.replace capture, paramifyString(capture, params)

  new RegExp("^#{str}$")

Route.get = (uri, callback) ->
  new Route
    uri : uri
    method : 'GET'
    callback : callback

Route.post = (uri, callback) ->
  new Route
    uri : uri
    method : 'POST'
    callback : callback

exports.Route = Route