const CracoAlias = require('craco-alias');
const webpack = require('webpack');
const path = require('path');

// TODO - fix deprecation warnings
module.exports = {
  devServer: devServer => {
    return {
      ...devServer,
      headers: {
        ...(devServer.headers || {}),
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    };
  },
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
        overrideWebpackConfig: ({ webpackConfig, context: { env } }) => {
          if (env === 'production') {
            webpackConfig.devtool = 'none';
          }
          webpackConfig.plugins.push(
            new webpack.optimize.LimitChunkCountPlugin({
              maxChunks: 1,
            }),
          );
          webpackConfig.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [
              {
                loader: path.resolve('loader.js'),
              },
            ],
          });

          // Always return the config object.
          return webpackConfig;
        },
      },
    },
  ],
};
