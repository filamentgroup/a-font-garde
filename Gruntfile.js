
/*global module:false require*/
module.exports = function(grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: grunt.file.read( 'src/banner' ),
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			lib: {
				src: ['lib/fontfaceonload.js']
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib_test: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib']
			},
			src: {
				files: [ '<%= concat.js.src %>', '<%= concat.css.src %>' ],
				tasks: [ 'concat', 'replace' ]
			}
		},
		bytesize: {
			src: {
				src: [
					'<%= pkg.name %>.css',
					'<%= pkg.name %>.js'
				]
			}
		},
		concat: {
			options: {
				stripBanners: false,
				banner: '<%= banner %>'
			},
			js: {
				src: [ 'src/fontfaceonload.js', 'src/<%= pkg.name %>.tmpl.js' ],
				dest: '<%= pkg.name %>.js'
			},
			css: {
				src: [ 'src/<%= pkg.name %>.tmpl.css' ],
				dest: '<%= pkg.name %>.css'
			}
		},
		'gh-pages': {
			options: {},
			src: ['.gitignore', '*.js', '*.css', '*.html', 'lib/*', 'fonts/**/*' ]
		},
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: /\{\{(\w*)\}\}/g,
							replacement: function( match, key ) {
								return grunt.template.process( "<%= pkg.config." + key + " %>" );
							}
						}
					]
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: [ '<%= pkg.name %>.css', '<%= pkg.name %>.js' ],
						dest: './'
					}
				]
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Default task.
	grunt.registerTask('default', ['jshint', 'concat', 'replace', 'bytesize:src']);

};
