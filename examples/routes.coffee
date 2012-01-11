waypoint = require '../lib/waypoint'
router = new waypoint.Router
Route = waypoint.Route

# Add route with Route instance
route = new Route
  uri      : '/'
  method   : 'get'
  callback : -> console.log '/'
router.route route

# Add route with plain object
router.route
  uri      : '/'
  method   : 'get'
  callback : -> console.log '/'

# Add route with Route instance shorthand
router.route Route.get('/home', -> console.log('/home'))
router.route Route.post('/contact', -> console.log('POST:/contact'))

# Match GET /
router.dispatch '/'

# Match GET /home
router.dispatch '/home'

# Match POST /contact
router.dispatch
  'uri'    : '/contact'
  'method' : 'post'

# Multiple routes
router.routes [
  Route.get '/path',    -> console.log('path')
  Route.get '/another', -> console.log('another')
]

router.dispatch '/path'