/*
 After you have changed the settings under responsive_images
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            /* Change these */
            width: 1600,
            suffix: '_large_2x',
            quality: 85
          },{
            /* Change these */
            width: 800,
            suffix: '_small_1x',
            quality: 60
          },{
            /* Change these */
            width: 1000,
            suffix: '_medium',
            quality: 80
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img/',
          dest: 'imgs/'
        }]
      }
    },

    resize_crop: {
      dev: {
        options: {
          gravity: "center",
          format: "jpg",
          width: 500
        },

        files: {
          "imgs" : ['img/*.{gif,jpg,png}'],
        },
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['imgs'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['imgs']
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-resize-crop');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images', 'resize_crop']);

};
