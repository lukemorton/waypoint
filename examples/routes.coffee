waypoint = require '../lib/waypoint'
router = new waypoint.Router
Route = waypoint.Route

# Add route with Route instance
router.route new Route 'GET', '/', -> console.log '/'

# Add route with args
router.route 'GET', '/', -> console.log '/'

# Add route with Route instance shorthand
router.get  '/home',    -> console.log '/home'
router.post '/contact', -> console.log 'POST:/contact'

# Match GET /
router.dispatch '/'

# Match GET /home
router.dispatch '/home'

# Match POST /contact
router.dispatch
  'uri'    : '/contact'
  'method' : 'post'

# Multiple routes
router.routes = [
  new Route 'GET', '/path',    -> console.log 'path'
  new Route 'GET', '/another', -> console.log 'another'
]

router.dispatch '/path'