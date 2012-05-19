/**
 * Take for Node.js
 * Unites syncronous and asynchronous logic into
 * a single, simple, and reliable system.
 * @author Nate Ferrero
 */
module.exports = function() {

	/**
	 * Capture and verify arguments
	 */
	var args = {};
	for(var i in arguments)
		if(typeof arguments[i] !== 'string')
			throw new TypeError("take(...args...)(func); Each of args must be a string");
		else
			args[arguments[i]] = 0;

	/**
	 * Wrap a function to be called when
	 * all arguments are populated
	 */
	return function(func) {

		/**
		 * Ensure function
		 */
		if(typeof func !== 'function')
			throw new TypeError("take(...args...)(func); func must be a function");

		/**
		 * Utilities
		 */
		var util = {};

		/**
		 * Default reply handler
		 */
		util.reply = function() {};

		/**
		 * Prepare scope and setter logic
		 */
		util.scope = {};
		util.set = {};
		util.setter = function(arg) {

			/**
			 * Add the setter
			 */
			util.set[arg] = function(value) {

				/**
				 * Ensure that each argument is set only once
				 */
				if(args[arg] == 1)
					throw new Error("Argument " + arg + " was previously specified");

				/**
				 * Record the value in scope and mark as used
				 */
				util.scope[arg] = value;
				args[arg] = 1;

				/**
				 * Don't process function if any argument is still missing
				 */
				for(var x in args) {
					if(args[x] == 0) {

						/**
						 * Still missing
						 */
						return false;
					}
				}

				/**
				 * Run on next tick to allow completion
				 * of other logic in the invoke method
				 */
				process.nextTick(function() {
					func.apply(util.scope, [util.reply]);
				});

				/**
				 * All args populated
				 */
				return true;
			}

		}

		/**
		 * Define the setter for each arg
		 */
		for(var arg in args) util.setter(arg);

		/**
		 * Wrap a function that provides the arguments
		 */
		return function(invoke) {

			/**
			 * Start - on next tick to allow for handlers
			 * to be added on the chain
			 */
			process.nextTick(function() {
				invoke.apply(util.set);
			});

			/**
			 * Allow then and error handling chaining
			 */
			return {

				/**
				 * Do something with the reply
				 */
				'then': function(func) {

					/**
					 * Ensure function
					 */
					if(typeof func !== 'function')
						throw new TypeError(".then(func); func must be a function");

					/**
					 * Set as reply handler
					 */
					util.reply = func;

				}

			}

		}

	}

}