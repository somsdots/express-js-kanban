/* eslint no-console: 0 */

module.exports = (grunt, path) => {
  grunt.loadNpmTasks('grunt-express-server');
  return {
    dev: {
      options: {
        script: './app/index.js',
		node_env: 'development'
      }
    }
  };
};
