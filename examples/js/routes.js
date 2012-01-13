var waypoint = require('../lib/waypoint');
var Router = waypoint.Router;
var Route = waypoint.Route;

var router = new Router({
	'routes' : [
		new Route('/home/:a', function (a) {
			console.log('root', a);
		})
	],
	'notFound' : function () {
		console.log('No route was matched');
	}
});

router.dispatch('/home/bob');
router.dispatch('/non-existent');