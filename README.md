# Take for Node.js and the browser

Take allows you to create expectation functions that are only processed when all of the arguments are set, and these arguments may be set at any time, and in any order.

## Installation

Install through npm or clone the repository!

```npm install take```

## Creating a Take Function

```JavaScript

var take = require('take');

var addNumbers = take('num1', 'num2')(function(reply) {
	
	/**
	 * All variables are properties of "this"
	 */
	reply(this.num1 + this.num2);

});
```

## Invoking the Take Function You Just Created

```JavaScript
addNumbers(function(set) {

	/**
	 * Populate the arguments in any order at any time
	 * all arguments have setter methods on "set"
	 */
	set.num2(40);

	/**
	 * Send the second argument after some time (1s)
	 */
	setTimeout(function() {
		set.num1(60);
	}, 1000);
	
}).then(function(result) {

	console.log('The sum is:', result);

})
```

You should see, after 1 second, "The sum is: 100" on the console!