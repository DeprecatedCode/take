/**
 * Simple Take Example
 * Math!
 * @author Nate Ferrero
 */
var take = require('../index');

/**
 * Start out with an addition method
 */
var add = take('a', 'b')(function(reply) {

	/**
	 * Arguments are populated into this
	 */
	reply(this.a + this.b);

});

/**
 * Let's define another method
 */
var multiply = take('x', 'y')(function(reply) {

	/**
	 * Reply
	 */
	reply(this.x * this.y);

});

/**
 * To provide a function argument, call
 * this.arg. Once all are provided, the function
 * executes. When using reply, pass the function
 * into a .then handler.
 */
add(function(set) {

	/**
	 * Let's use some random nums
	 */
	set.a(Math.random()*100);
	set.b(Math.random()*100);

}).then(function(result) {

	/**
	 * Log
	 */
	console.log("The sum is " + result);

	multiply(function(set) {

		set.x(result);
		set.y(10);

	}).then(function(result) {

		/**
		 * Log
		 */
		console.log("The product is " + result);

	});

});