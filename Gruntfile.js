module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				sourceMap: true,
				// sourceMapIncludeSources: true,
				// sourceMapName: 'datePicker.js.map',
				report: 'gzip'
			},
			my_target: {
				files: [{
					'datePicker.min.js': ['calendar.js', 'datePicker.js']
				},
				{
					'jqDatePicker.min.js': ['calendar.js', 'datePicker.js', 'jqDatePicker.js']
				}]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);

};