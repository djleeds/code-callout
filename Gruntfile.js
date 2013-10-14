module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: [
				"Gruntfile.js",
				"lib/**/*.js",
				"spec/**/*.js"
			]
		},
		testem: {
			tests: {
				src: [
					"bower_components/jquery/dist/jquery.min.js",
					"bower_components/jasmine-jquery/lib/jasmine-jquery.js",
					"lib/*.js",
					"spec/spec-setup.js",
					"spec/models/*.js",
					"spec/features/*.js"
				],
				options: {
					framework: "jasmine2",
					launch_in_ci: [ "PhantomJS" ],
					launch_in_dev: [ "PhantomJS"]
				}
			}
		},
		uglify: {
			options: {
				report: "gzip",
				preserveComments: "all"
			},
			build: {
				src: "lib/jquery.code-callout.js",
				dest: "dist/jquery.code-callout.min.js"
			},
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-testem");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("default", ["jshint", "testem:ci:tests"]);
	grunt.registerTask("build", ["uglify", "testem:ci:tests"]);

};
