const webpack = require('webpack');
const fs = require('fs');

function readDocDate(docPath) {
  const doc = fs.readFileSync(docPath, {
    encoding: 'utf8',
    flag: 'r',
  });
  const firstLine = doc.slice(0, doc.indexOf('\r'));
  return new Date(firstLine.split('Last updated ')[1]);
}

module.exports = {
  plugin: {
    overrideWebpackConfig({ webpackConfig }) {
      const privacyDate = readDocDate('./public/privacy-policy.txt');
      const termsDate = readDocDate('./public/terms-of-services.txt');
      const maxDate =
        privacyDate.getTime() > termsDate.getTime() ? privacyDate : termsDate;

      webpackConfig.plugins.push(
        new webpack.EnvironmentPlugin({
          REACT_APP_DOCS_DATE: maxDate.getTime(),
        }),
      );

      return webpackConfig;
    },
  },
};
