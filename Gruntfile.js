module.exports = function(grunt) {
	grunt.initConfig({

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/scripts/collapse.js', 'js/scripts/carousel2.js', 'js/scripts/tabs.js', 'js/scripts/validator2.js', 'js/scripts/custom-number.js', 'js/scripts/modals.js', 'js/scripts/scripts.js'],
        dest: 'js/dublin.js',
      },
    },

    uglify: {
      my_target: {
        files: {
          'js/dublin.min.js': ['js/dublin.js']
        }
      }
    },

  	less: {
      development: {
        options: {
          compress: true
        },
        files: {
          "css/dublin.min.css": "less/dublin.less" // destination file and source file
        }
      }
    },

    watch: {
      styles: {
        files: ['less/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }

	})
	
	grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['less', 'watch']);
}