/**
 * Define a custom class representing the requirements of a jasmine suite.
 *
 * @author: Sam Skjonsberg <sskjonsberg@opencar.com>
 */

if(!jasmine) {
    throw Error('Core jasmine Library not defined!');
}

(function() {

    /**
     * @class
     * @description
     * Class representing the script requirements of a given jasmine suite.
     *
     * @param   {Array} reqs    Array of script requirements.
     *
     * @constructor
     */
    jasmine.SuiteRequirements = function(reqs) {
        this.reqs = reqs;
    };

    /**
     * @function
     * @description
     * Loads the suite requirements and keep references to any associated exports.
     *
     * @param   {Function}  complete        A function to execute when the suite requirements have been loaded.
     *
     * @return  {jasmine.SuiteRequirements} The suite requirements.
     */
    jasmine.SuiteRequirements.prototype.execute = function(complete) {
        require(
            this.reqs,
            function() {
                this.exports = Array.prototype.slice.call(arguments);
                if(typeof complete === 'function') {
                    complete();
                }
            }.bind(this),
            function(err) {
                if(typeof complete === 'function') {
                    complete();
                }
            }.bind(this)
        );
        return this;
    };

}());