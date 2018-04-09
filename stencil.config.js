const sass = require('@stencil/sass');

exports.config = {
  hashFileNames: false,
  outputTargets: [
    {
      type: 'www',
      empty: false,
      serviceWorker: {
        swSrc: 'src/sw.js',
        globIgnores: [
          'docs/**/*',
          'build/app/svg/*.js',
          'build/app/*.es5.js'
        ]
      }
    }
  ],
  globalStyle: "src/global/app.css",
  enableCache: false,
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}