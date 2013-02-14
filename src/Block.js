/**
 * Extensions of jasmine.Suite for supporting Suite requirements.
 *
 * @author: Sam Skjonsberg <sskjonsberg@opencar.com>
 */

if(!jasmine || !jasmine.Block) {
    throw Error('Core jasmine Library not defined!');
}

/**
 * @function
 * @description
 * Overwrite the default Jasmine.Block.prototype.execute method so that when executing blocks the requirements associated
 * with the parent suite(s) are provided as arguments to the block.
 *
 *
 * @param   {Function}  complete    The function to execute once the block has been executed.
 *
 * @return  {void}
 */
jasmine.Block.prototype.execute = jasmintd.Function.wrap(
    jasmine.Block.prototype.execute,
    function(orig, complete) {
        this.func = jasmintd.Function.wrap(
            this.func,
            function(orig) {
                return orig.apply(this, this.suite.getRequirementExports());
            }
        );
        return orig(complete);
    }
);