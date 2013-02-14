/**
 * Extension specifics specific to the manipulation of Functions.
 *
 * @author: Sam Skjonsberg <sskjonsberg@opencar.com>
 */

var jasmintd = jasmintd || {};

/**
 * @description
 * Wraps the specified method with the specified method such that when executed, the second method is executed with
 * the first as it's first parameter.
 *
 * @param   {Function}  orig    The method to wrap.
 * @param   {Function}  func    The method to wrap the original function in.
 *
 * @returns {Function}  A new Function, which when executed passes the original Function instance
 *                      as the first parameter to the provided Function, as well as the arguments provided
 *                      at execution time, in the order originally provided.
 */
jasmintd.Function = {
    wrap :  function(orig, func) {
        return function() {
            return func.apply(
                this,
                [ orig.bind(this) ].concat(Array.prototype.slice.call(arguments, 0))
            );
        };
    }
};