var grunt = require('grunt');

var gruntConfig = {
	sass: {
		options: {
			includePaths: [
				'node_modules/foundation-sites/scss'
			]
		},
		dist: {
			files: {
				'public/css/app.css': 'scss/app.scss'
			}
		}
	},

	watch: {
		files: ['scss/**/*.scss'],
		tasks: ['sass:dist'],
		options: {
			spawn: false
		}
	}
};

grunt.initConfig(gruntConfig);

grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask('default', ['watch'])
