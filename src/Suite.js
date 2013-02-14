/**
 * Extensions of jasmine.Suite for supporting Suite requirements.
 *
 * @author: Sam Skjonsberg <sskjonsberg@opencar.com>
 */

if(!jasmine || !jasmine.Suite) {
    throw Error('Core jasmine Library not defined!');
}

(function() {
    var reSpacePrePeriod    = /\s+[.]+/g;

    /**
     * @function
     * @description
     * Adds the specified suite requirements.
     *
     * @param   {Array} reqs    Array of script requirements to add.
     *
     * @return  {jasmine.Suite} The suite.
     */
    jasmine.Suite.prototype.addRequirements = function(reqs) {
        this.reqs = new jasmine.SuiteRequirements(reqs);
        this.queue.addBefore(this.reqs);
        return this;
    };

    /**
     * @function
     * @description
     * Returns the exports defined by the suite's associated script requirements as an array.
     *
     * @return {Array}  Array of the exports defined by the suite's associated script requirements.
     */
    jasmine.Suite.prototype.getRequirementExports = function() {
        var suite   = this,
            exports = [];
        do {
            if(suite.reqs && suite.reqs.exports) {
                exports = exports.concat(suite.reqs.exports);
            }
            suite = suite.parentSuite;
        } while(suite);
        return exports;
    };

    /**
     * @function
     * @description
     * Extended jasmine.Suite.prototype.getFullName which provides support for custom formatting that meshes better
     * with JSTD's console output.
     *
     * @param   {Boolean}   formatForJSTD   Boolean indicating whether the full name should be formatted for JSTD output.
     *
     * @return  {String}    The suite's full name.
     */
    jasmine.Suite.prototype.getFullName = jasmintd.Function.wrap(
        jasmine.Suite.prototype.getFullName,
        function(orig, formatForJSTD) {
            var name = orig();
            return formatForJSTD ? name.replace(reSpacePrePeriod, '.') : name;
        }
    );

}());