/**
 * Grunt configuration for jasmintd project.
 *
 * @author Sam Skjonsberg <sskjonsberg@opencar.com>
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg     : '<json:package.json>',
        meta    : {
            banner : '/*!\n<%= pkg.name %>\nv <%= pkg.version %> ' +
                '<%= grunt.template.today("mm-dd-yyyy") %>\n*/'
        },
        lint    : {
            all : [
                'src/*.js'
            ]
        },
        concat : {
            dist : {
                src : [
                    'src/etc/jasmine/jasmine.js',
                    'src/etc/requirejs/require.js',
                    'src/Block.js',
                    'src/Function.js',
                    'src/JSTDReporter.js',
                    'Suite.js',
                    'SuiteRequirements'
                ],
                dest : 'build/jasmintd.js'
            }
        },
        min : {
            dist : {
                src     : [ '<banner>', 'build/jasmintd.js' ],
                dest    : 'dist/<%= pkg.name %>.<%= pkg.version %>.js'
            }
        }
    });
    grunt.registerTask('default', 'lint');
    grunt.registerTask('build', 'concat min');
};