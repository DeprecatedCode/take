/**
 * Take for Node.js
 * Unites syncronous and asynchronous logic into
 * a single, simple, and reliable system.
 * @author Nate Ferrero
 */
module.exports = function() {

	var take = arguments;

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
		 * Wrap a function that provides the arguments
		 */
		return function(invoke) {

			/**
			 * Ref-level scope
			 */
			var master = {};

			/**
			 * Default reply handler
			 */
			master.reply = function() {};

			/**
			 * Start - on next tick to allow for handlers
			 * to be added on the chain
			 */
			var go = function() {

				/**
				 * Capture and verify arguments
				 */
				var args = {};
				for(var i in take)
					if(typeof take[i] !== 'string')
						throw new TypeError("take(...args...)(func); Each of args must be a string");
					else
						args[take[i]] = 0;

				/**
				 * Utilities
				 */
				var util = {};

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
							func.apply({}, [util.scope, master.reply]);
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

				invoke.call({}, util.set);
			};

			process.nextTick(function() {
				if(!master.ref) go();
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
					master.reply = func;

					return this;
				},

				/**
				 * Grab a reference to execute later
				 */
				'ref': function() {
					master.ref = true;
					return go;
				}

			}

		}

	}

}