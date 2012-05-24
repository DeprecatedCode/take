var take = require('../index');

var addNumbers = take('num1', 'num2')(function(args, reply) {

    /**
     * All variables are properties of "args"
     */
    reply(args.num1 + args.num2);

});

/**
 * Invoking the Take Function You Just Created
 */

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

});