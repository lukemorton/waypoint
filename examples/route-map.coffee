waypoint = require '../lib/waypoint'
router = new waypoint.Router
  baseUri: '/'

# A simple controller object
simpleController =
  'index'       : ()   -> console.log 'index'
  'about'       : ()   -> console.log 'about'
  'allProducts' : ()   -> console.log 'all products'
  'aProduct'    : (id) -> console.log 'product: ', id
  'contact'     : ()   -> console.log 'contact'
  'logout'      : ()   -> console.log 'logging out'
  'redirect'    : (uri)->
    ()->
      console.log 'redirected to', uri

# Use routeMap to generate and add routes to router
router.routeMap
  '' : simpleController.index
  'about' : simpleController.about

  'products' :
    # Nested routes are sugar
    ''     : simpleController.redirect('/products/all')
    '/all' : simpleController.allProducts
    '/:id' : simpleController.aProduct

  # Match a POST request for /contact
  'POST contact' : simpleController.contact

  # Multiple callbacks supported as array
  'logout' : [
    simpleController.logout
    simpleController.redirect('/')
  ]

router.dispatch '/'
router.dispatch '/products'
router.dispatch '/products/all'
router.dispatch '/products/100'
router.dispatch '/logout'