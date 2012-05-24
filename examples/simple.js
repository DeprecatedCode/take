/**
 * Simple Take Example
 * @author Nate Ferrero
 */
var take = require('../index');

/**
 * Log a message
 */
var log = take('message')(function(args) {

	/**
	 * Arguments are populated into args
	 */
	console.log(args.message);

});

/**
 * Instead of passing arguments directly, pass
 * a method that sets the arguments.
 */
log(function(set) {

	setTimeout(function() {

		set.message("Hello, World");

	}, 1000);

});