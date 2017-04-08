const webpack = require('webpack');

require('path');

module.exports = {
  context: __dirname + '\\src',
  entry: {
    javascript: './index.js',
    html: __dirname + '/public/index.html',
  },
  output: {
    filename: './app.js',
    path: __dirname + '/build',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
          test: /\.(woff2?|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader?name=[name].[ext]',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
