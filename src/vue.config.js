const srcPath = __dirname;
const appPath = `${__dirname}/app`;
const outputPath = `${__dirname}/dist`;

module.exports = {
  devServer: {
    https: true,
 
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

    /** below is the loader code as required in vue3 */

    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      })

      /** */

    config.plugin('html').tap((args) => {
      args[0].hash = false;
      return args;
    });

    config.output.filename('[name].[hash].js').end(); // Update the output filename

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
          filename: 'vendors.[hash].js'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          filename: 'common.[hash].js'
        }
      }
    });

    // pathConfigs unshift was crashing
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
