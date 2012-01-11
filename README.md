# Waypoint

A CoffeeScript URI router for use anywhere.

## In the browser

First you'll want to clone the git repository like so:

	git clone git://github.com/DrPheltRight/waypoint.git
	cd waypoint

You'll find the latest development version of Waypoint for the
browser in the `dist` directory. You can either use this or
build your own like so:

	cake build

If you wanted to build the master version you can simply
checkout that branch.

Now you can use the browser edition as shown in
`example/browser.html`. It is AMD, CommonJS and global
compatible so include it how you wish.

## On the server

You can use NPM to install waypoint like so:

	npm install waypoint

This will install it into `node_modules` within your current
directory. *You probably wouldn't want to use waypoint
globally.*

Once you have waypoint installed you can require it like
normal:

``` js
var waypoint = require('waypoint'),
	router = new waypoint.Router;

router.routeMap({
	'/' : function () {
		console.log('Index');
	},
	'/:name': function (name) {
		console.log('Hello', name);
	}
})

router.dispatch('/');
router.dispatch('/Bob');
```

## Contributing

If you wish to hack on waypoint clone the development branch
and use `npm link` to ensure your working directory is
symlinked into node's include path.

## Author

Luke Morton a.k.a. DrPheltRight

## License

MIT