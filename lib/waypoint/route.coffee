class Route
  constructor: (method, uri, callback) ->
    unless callback?
      callback = uri
      uri = method
      method = 'GET'

    @regex = regifyString(uri, {}) unless uri instanceof RegExp

    @method = method.toUpperCase()
    @callback = callback if callback?

  # The following methods are CoffeeScript ports of JS from
  # the Director router.
  # See: https://github.com/flatiron/director
  paramifyString = (str, params, mod) ->
    mod = str

    for param in params
      if params.hasOwnProperty(param)
        mod = params[param](str)
        break if mod isnt str
    
    if mod is str then '([a-zA-Z0-9-]+)' else mod

  regifyString = (str, params) ->
    if str.indexOf '*' isnt -1
      str = str.replace /\*/g, '([_\.\(\)!\\ %@&a-zA-Z0-9-]+)'
    
    captures = str.match(/:([^\/]+)/ig)
        
    if captures
      for capture in captures
        str = str.replace capture, paramifyString(capture, params)

    new RegExp("^#{str}$")

  match: (method, uri) ->
    unless uri?
      uri = method
      method = null

    return no if method? and @method isnt method.toUpperCase()

    matches = @regex.exec(uri)
    return matches[1..] if matches and matches.length?
    no

exports.Route = Route