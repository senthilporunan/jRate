module.exports = function(grunt) {
    grunt.initConfig({
		uglify: {
			options: {
				banner: '/*!The MIT License (MIT) Copyright (c) 2015 Senthil Porunan (senthilraja39@gmail.com)' + 
						'<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			my_target: {
				files: {
					'dist/jRate.min.js': ['src/*.js']
				}
			}
		}
    });

	 grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};
