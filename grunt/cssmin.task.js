module.exports = (grunt, path) => {
  const files = {};
  const output = grunt.option('out') || 'app';
  files[`${path}/app/public/css/${output}.min.css`] = [
    '*.css',
    '!*.min.css'
  ].map(file => `${path}/assets/css/${file}`);
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  return {
    options: { keepSpecialComments: 0 },
    target: { files }
  };
};
