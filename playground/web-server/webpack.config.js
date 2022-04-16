var path = require('path');

module.exports = {
  entry: './',
  devServer: {
    contentBase: path.join(__dirname, '../packages/web/build/'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
};
