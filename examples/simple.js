/**
 * Simple Take Example
 * @author Nate Ferrero
 */
var take = require('../index');

/**
 * Log a message
 */
var log = take('message')(function() {

	/**
	 * Arguments are populated into this
	 */
	console.log(this.message);

});

/**
 * Instead of passing arguments directly, pass
 * a method that calls the arguments.
 */
log(function() {
	this.message("Hello, World");
});