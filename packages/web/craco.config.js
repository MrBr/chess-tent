const CracoAlias = require('craco-alias');
const webpack = require('webpack');

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: './src',
        // tsConfigPath should point to the file where "baseUrl" and "paths" are specified
        tsConfigPath: './tsconfig.paths.json',
      },
    },
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.plugins.push(
            new webpack.optimize.LimitChunkCountPlugin({
              maxChunks: 1,
            }),
          );

          // Always return the config object.
          return webpackConfig;
        },
      },
    },
  ],
};
