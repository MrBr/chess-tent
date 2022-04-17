const path = require('path');
var DynamicAliasResolvePlugin = require('dynamic-alias-resolve-plugin');

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
