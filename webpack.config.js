const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: [ './frontend/index.ts' ],
    vender: [ 'react', 'react-dom' ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'frontend/tsconfig.json',
        },
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist', 'public'),
    publicPath: 'static',
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};
