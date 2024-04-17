const path = require('path');

const srcPath = __dirname;
const appPath = `${__dirname}/app`;
const outputPath = `${__dirname}/dist`;

module.exports = {
  devServer: {
    https: true,
    client: {
      overlay: false,
    },
    onListening: (devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      const { port } = devServer.options;
      console.log(`Dev server is running on port ${port}`);
    },
  },
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
    entry: {
      app: `${appPath}/main.js`,
    },
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
      filename: 'js/script.[hash:8].js',
      chunkFilename: 'js/[id].[hash:8].js',
    },
    plugins: [],
  },
  chainWebpack: (config) => {
    // Set up the compatibility mode for Vue 3
    config.resolve.alias.set('vue', '@vue/compat');
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        };
      });

    // Update the HTML plugin configuration
    config.plugin('html').tap((args) => {
      args[0].hash = false;
      return args;
    });

    // Update the output filename
    config.output.filename('[name].[hash].js').end();

    // Configure the code splitting
    config.optimization.splitChunks({
      chunks: 'all',
      name: 'vendors',
      minSize: 10000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          filename: 'vendors.[hash].js',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          filename: 'common.[hash].js',
        },
      },
    });

    // Copy the .htaccess file
    config.plugin('copy').tap(([pathConfigs]) => {
      if (Array.isArray(pathConfigs)) {
        pathConfigs.unshift({
          from: `${appPath}/assets/.htaccess`,
          to: `${outputPath}/.htaccess`,
          toType: 'file',
        });
      }
      return [pathConfigs];
    });
  },
};