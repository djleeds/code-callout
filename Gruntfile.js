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
		jasmine_node: {
			verbose: false,
			forceExit: true
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
	grunt.loadNpmTasks("grunt-jasmine-node");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask('default', ['jshint', 'jasmine_node']);
	grunt.registerTask("build", function() {
		process.env.TARGET_CODE_FILE = "dist/jquery.code-callout.min";
		grunt.task.run("uglify", "jasmine_node");
	});

};
