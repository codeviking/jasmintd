var jasmintd = jasmintd || {};

(function() {

    var reLineEnd           = /\n+/,
        reTrailingPeriod    = /[.]+$/,
        reJasmine           = /\/jasmintd/,
        reTestUrl           = /https?:\/\/\w+(:\d+)?\/test\//,
        /**
         * @enum
         * @description
         * Collection of possible colors for output.
         */
        Colors = {
            PINK    : '\033[95m',
            YELLOW  : '\033[93m',
            RED     : '\033[91m',
            END     : '\033[0m'
        },
        /**
         * @private
         * @description
         * Sets the specified string to be output in the specified color.
         *
         * @param   {String}    str     The string.
         * @param   {String}    color   The color to set.
         *
         * @return {String}     The string in the specified color.
         */
        setColor = function(str, color) {
            return [ color,  str,  Colors.END ].join('');
        };


    /**
     * @class
     * @description
     * Custom reporter which handles translating Jasmine test results to JSTestDriver's reporter.
     *
     * @param   {Function}  done        Callback to execute when an individual spec is complete.
     * @param   {Function}  completed   Callback to execute when the entire test suite is complete.
     * @constructor
     */
    jasmintd.JSTDReporter = function(done, completed) {
        this.done           = done;
        this.completed      = completed;
    };
    jasmine.util.inherit(jasmintd.JSTDReporter, jasmine.Reporter);

    /**
     * @description
     * Fires when a spec execution begins.
     *
     * @return {void}
     */
    jasmintd.JSTDReporter.prototype.reportSpecStarting = function() {
        this.start = Date.now();
    };

    /**
     * @description
     * Fires when spec execution is complete.
     *
     * @param   {jasmine.Spec}  spec    The spec which just finished executing.
     *
     * @return  {void}
     */
    jasmintd.JSTDReporter.prototype.reportSpecResults = function(spec) {
        var elapsed     = Date.now() - this.start,
            results     = spec.results(),
            logMessages = [],
            messages    = [],
            item,
            items,
            i,
            ii;
        if(results.skipped) {
            return;
        }
        items = results.getItems();
        for(i = 0, ii = items.length; i < ii; i++) {
            item = items[i];
            if(item instanceof jasmine.MessageResult) {
                logMessages.push(setColor(item.toString(), Colors.YELLOW));
            } else if(!item.passed()) {
                messages.push(
                    {
                        // The message or name doesn't end up being formatted all that well by JSTD, especially if there's multiple.
                        // So we just let the stack do the work for us...
                        message : '',
                        name    : '',
                        stack   : this.formatErrorStack(item.trace.stack)
                    }
                );
            }
        }
        // Pass our results to JSTD.  For documentation of jstestdriver.TestResult see:
        // @see http://code.google.com/p/js-test-driver/source/browse/JsTestDriver/src/com/google/jstestdriver/javascript/TestResult.js?r=9222e94ae1d89532b4b0de2d6b43e6c11ae0060f
        this.done(
            new jstestdriver.TestResult(
                // We pass the name and description as a single string to JSTD so that it doesn't look like:
                // "Name.description".
                this.formatTestName(spec.suite.getFullName(true)),
                spec.description,
                results.failedCount > 0 ? jstestdriver.TestResult.RESULT.FAILED : jstestdriver.TestResult.RESULT.PASSED,
                jstestdriver.angular.toJson(messages),
                logMessages.join('\n'),
                elapsed
            )
        );
    };

    /**
     * @description
     * Fires when the entire suite is finished executing.
     *
     * @return {void}
     */
    jasmintd.JSTDReporter.prototype.reportRunnerResults = function() {
        // Execute the completed callback, when signals JSTD that execution is complete.
        this.completed();
    };

    /**
     * @description
     * Formats the test name for better presentation on the terminal within JSTD's output.
     *
     * @param   {String}    name    The name to format.
     *
     * @return  {String}    The formatted name.
     */
    jasmintd.JSTDReporter.prototype.formatTestName = function(name) {
        return setColor(name.replace(reTrailingPeriod, ''), Colors.PINK) + '..';
    };

    /**
     * @description
     * Formats the error stack associated with a test failure by stripping out portions of the stack trace
     * that are related to the internal jasmine library.
     *
     * @param   {String}    stack   The stack trace to format.
     *
     * @return  {String}    The formatted stack trace.
     */
    jasmintd.JSTDReporter.prototype.formatErrorStack = function(stack) {
        var line,
            lines = (stack || '').split(reLineEnd),
            i,
            ii,
            result = [];
        for(i = 0, ii = lines.length; i < ii; i++) {
            line = lines[i];
            if(line.length > 0 && !line.match(reJasmine)) {
                result.push(
                    setColor(line.replace(reTestUrl, ''), Colors.RED)
                );
            }
        }
        return result.join('\n');
    };

}());