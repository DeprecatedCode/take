/**
 * Simple Take Example
 * Caching!
 * @author Nate Ferrero
 */
var take = require('../index'),
	http = require('http'),
	url  = require('url');

var cache = {};

var load = take('url')(function(args, reply) {

	if(cache[args.url])
		return reply({cache: true, body: cache[args.url], url: args.url});

	var opts = url.parse(args.url);
	opts.port = 80;

	/**
	 * Create a request object
	 */
	var request = http.get(opts);

	/**
	 * Listen for the body
	 */
	request.on('response', function (response) {

		var body = '';

		response.on('data', function (chunk) {
			body += chunk;
		});

		response.on('end', function () {
			
			/**
			 * Store to the cache
			 */
			cache[args.url] = body;
			reply({cache: false, body: body, url: args.url});

		});
	});

	/**
	 * Send the request
	 */
	request.end();

});

/**
 * Log some results
 */
function show(result) {
	console.log('==============', result.cache ? 'Loaded from cache for '+result.url+':' : 'Made HTTP GET request to '+result.url+':');
	console.log(result.body.substr(0, 310) + '...', '\n');
};

/**
 * Load Google
 */
var lg = load(function(set) {
	set.url('http://www.google.com');
}).then(show).ref();

setTimeout(lg, 0);
setTimeout(lg, 1000);

/**
 * Load Twitter
 */
var lt = load(function(set) {
	set.url('http://twitter.com');
}).then(show).ref();

setTimeout(lt, 2000);