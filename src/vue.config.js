const srcPath = __dirname;
const appPath = `${__dirname}/app`;
const outputPath = `${__dirname}/dist`;

module.exports = {
  lintOnSave: false,
  outputDir: outputPath,
  configureWebpack: {
    resolve: {
      alias: {
        '@': appPath,
        '#': srcPath,
      },
      symlinks: false,
    },
    entry: { app: `${appPath}/main.js` },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        },
      ],
    },
    output: {
      // filename: 'js/script.js',
      filename: 'js/script.[hash:8].js',
      chunkFilename: 'js/[id].[hash:8].js',
    },
    plugins: [],
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].hash = false;
      return args;
    });
    config.plugin('copy').tap(([pathConfigs]) => {
      pathConfigs.unshift({
        from: `${appPath}/assets/.htaccess`,
        to: `${outputPath}/.htaccess`,
        toType: 'file',
      });
      return [pathConfigs];
    });
  },
};
