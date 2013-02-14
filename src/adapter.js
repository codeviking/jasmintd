/**
 * Adapter for running Jasmine BDD unit tests using JsTestDriver and requirejs.
 *
 * @author: Sam Skjonsberg <sskjonsberg@opencar.com>
 */
(function() {

    var TestType = {
            JASMINE : 'jasmine'
        };

    /**
     * @private
     * @description
     * Custom describe method which provides support for our special syntax where we provide the tests reqs
     * in it's definition.
     *
     * @param   {Function}          orig    The original describe function.
     * @param   {String}            name    The suite name.
     * @param   {Array}             [reqs]  Optional Array of script requirements.
     * @param   {Function}          fn      The suite definition.
     *
     * @return  {void}
     */
    describe = jasmintd.Function.wrap(
        describe,
        function(orig, name, reqs, fn) {
            var suite;
            if(typeof reqs === 'function') {
                fn      = reqs;
                reqs    = [];
            }
            return orig(name, fn).addRequirements(reqs);
        }
    );

    /**
     * @private
     * @description
     * Registers the Jasmine / RequireJS Adapter Plugin.
     */
    jstestdriver.pluginRegistrar.register(
        {
            /** @type {String} */
            name : "Jasmine and RequireJS Adapter",
            /**
             * @private
             * @description
             * Fires whenever we execute a test.  Here we wire up our custom JSTDReporter and pass it the done and complete
             * callbacks, so that it can notify JSTD when a test has finished executing.
             *
             * @param   {jstestdriver.TestRunConfiguration}     config      The test configuration.
             * @param   {Function}                              done        Callback to execute when an individual test / spec has finished.
             * @param   {Function}                              completed   Callback to execute when the entire test case / suite has finished.
             *
             * @return {Boolean}    Boolean indicating if the plugin can handle executing the specified test.
             */
            runTestConfiguration : function(config, done, completed) {
                var handled = config.getTestCaseInfo().getType() === TestType.JASMINE;
                if(handled) {
                    jasmine.getEnv().addReporter(new jasmintd.JSTDReporter(done, completed));
                    jasmine.getEnv().execute();
                }
                return handled;
            },
            /**
             * @private
             * @description
             * Fires after tests have been loaded, prior to tests being executed, providing a chance to build the test
             * run configuration by hand.  In this method we let JSTD know about the Jasmine tests that we're about to run.
             *
             * @param   {Array<jstestdriver.TestCaseInfo>}          info        Array of test case information.
             * @param   {Array<string>}                             filters     Array of test filters.
             * @param   {Array<jstestdriver.TestRunConfiguration>}  testConfigs The Array of test configurations to populate.
             *
             * @return  {void}
             */
            getTestRunsConfigurationFor : function(info, filters, testConfigs) {
                var i,
                    ii,
                    j,
                    jj,
                    suites      = jasmine.getEnv().currentRunner().suites(),
                    all         = filters.indexOf('all') !== -1,
                    specNames,
                    specs;
                if(!all) {
                    jasmine.getEnv().specFilter = function(spec) {
                        var suite   =   (spec instanceof jasmine.Spec ? spec.suite : spec),
                            included = filters.indexOf(suite.getFullName(true)) !== -1;
                        if(!included) {
                            do {
                                included = filters.indexOf(suite.description) !== -1;
                            } while((suite = suite.parentSuite) && !included);
                        }
                        return included;
                    };
                }
                for(i = 0, ii = suites.length; i < ii; i++) {
                    if(all || jasmine.getEnv().specFilter(suites[i])) {
                        specs       = suites[i].specs();
                        specNames   = [];
                        for(j = 0, jj = specs.length; j < jj; j++) {
                            specNames.push(specs[j].description);
                        }
                        testConfigs.push(
                            new jstestdriver.TestRunConfiguration(
                                new jstestdriver.TestCaseInfo(
                                    suites[i].getFullName(true),
                                    TestCase(suites[i].getFullName(true)),
                                    TestType.JASMINE
                                ),
                                specNames
                            )
                        );
                    }
                }
            }
        }
    );

}());