const path = require('path');

module.exports = {
    mode: 'development',
  entry: './src/client/app.js',
  resolve: {
    extensions: [ '.js', '.json' ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  }
};