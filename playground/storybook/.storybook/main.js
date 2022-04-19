const path = require('path');
var DynamicAliasResolvePlugin = require('dynamic-alias-resolve-plugin');

// Helps properly resolve "relative" package alias
const moduleAliases = (moduleIdentifier, aliases) =>
  new DynamicAliasResolvePlugin({
    alias: Object.keys(aliases),
    dynamic: (request, alias) => {
      if (request.context.issuer.search(moduleIdentifier) > -1) {
        const moduleRelativeAliasPath = aliases[alias];
        if (moduleRelativeAliasPath) {
          return moduleRelativeAliasPath;
        }
        console.error(`Unhandled alias: ${alias}`);
      }
      return alias;
    },
  });

const webModule = moduleAliases('chess-tent/packages/web', {
  '@types': path.resolve(
    __dirname,
    '../../../packages/web/src/application/types/index.ts',
  ),
  '@application': path.resolve(
    __dirname,
    '../../../packages/web/src/application/index.ts',
  ),
});

module.exports = {
  webpackFinal: async config => {
    config.resolve.plugins = [...config.resolve.plugins, webModule];
    const fileLoaderRule = config.module.rules.find(
      rule => rule.test && rule.test.test('.svg'),
    );
    fileLoaderRule.exclude = /\.svg$/;

    // Import svg components as ReactComponent.
    // Has to match current react configuration otherwise default import is the component
    // and that breaks the code.
    config.module.rules.push({
      test: /\.svg$/,
      // Both loaders needs to be here.
      use: ['@svgr/webpack', 'file-loader'],
    });
    return config;
  },
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
};
