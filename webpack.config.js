const path = require('path');

module.exports = {
  entry: './src/react/app.js',
  output: {
    path: path.resolve(__dirname, 'src/js'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
