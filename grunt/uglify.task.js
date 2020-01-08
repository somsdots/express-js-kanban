module.exports = (grunt, path) => {
  const files = {};
  const output = grunt.option('out') || 'app';
  files[`${path}/app/public1/js/${output}.min.js`] = [
    '*.js',
    '!*.min.js'
  ].map(file => `${path}/assets/js/${file}`);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  return {
    min: {
      options: {
        mangle: true,
        compress: true
      },
      files
    }
  };
};
