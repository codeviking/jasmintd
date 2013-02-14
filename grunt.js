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
                    'src/Function.js',
                    'src/Block.js',
                    'src/SuiteRequirements.js',
                    'src/Suite.js',
                    'src/JSTDReporter.js',
                    'src/adapter.js'
                ],
                dest : 'build/jasmintd.js'
            }
        },
        min : {
            dist : {
                src     : [ '<banner>', 'build/jasmintd.js' ],
                dest    : 'build/jasmintd/jasmintd.js'
            }
        },
        licenses : {
            dest : 'build/jasmintd/',
        },
        compress : {
            main : {
                options : {
                    mode    : 'tgz'
                },
                files : [
                    {
                        src     : [ 'build/jasmintd/*' ],
                        dest    : 'dist/<%= pkg.name %>-<%= pkg.version %>.tar.gz'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask('default', 'lint');
    grunt.registerMultiTask('licenses', 'copy over required licenses', function() {
        var dir = grunt.template.process(this.data);
        grunt.file.copy(
            'src/etc/jasmine/MIT.LICENSE',
            dir + 'jasmine.MIT.LICENSE'
        );
        grunt.log.writeln('Copied src/etc/jasmine/MIT.LICENSE -> ' + dir + 'jasmine.MIT.LICENSE');
        grunt.file.copy(
            'src/etc/requirejs/LICENSE',
            dir + 'requirejs.LICENSE'
        );
        grunt.log.writeln('Copied src/etc/requirejs/LICENSE -> ' + dir + 'requirejs.LICENSE');
        grunt.file.copy(
            'LICENSE',
            dir + 'jasmintd.LICENSE'
        );
        grunt.log.writeln('Copied LICENSE -> ' + dir + 'jasmintd.LICENSE');
    });
    grunt.registerTask('build', 'concat min licenses compress');
};