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
        dist : {
            dest : 'dist/<%= pkg.version %>'
        },
        compress : {
            main : {
                options : {
                    mode    : 'tgz'
                },
                files : [
                    {
                        src     : [ 'dist/<%= pkg.version %>/*' ],
                        dest    : 'archive/<%= pkg.name %>-<%= pkg.version %>.tar.gz'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');

    // By default, simply lint
    grunt.registerTask('default', 'lint');

    // Copy over licenses into the build
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

    grunt.registerMultiTask('dist', 'distribute a build', function() {
        var dir = grunt.template.process(this.data);
        grunt.file.recurse(
            'build/jasmintd',
            function(abspath, rootdir, subdir, filename) {
                var newFile = dir + '/' + filename;
                grunt.file.copy(
                    abspath,
                    newFile
                );
                grunt.log.writeln('Copied ' + abspath + ' -> ' + newFile);
            }
        )
        grunt.log.ok(grunt.template.process('Published <%= pkg.name %> v<%= pkg.version %>'));
    });

    grunt.registerTask('build', 'concat min licenses');

    grunt.registerTask('publish', 'concat min licenses dist');

    grunt.registerTask('archive', 'publish compress')
};