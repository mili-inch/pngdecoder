/** @type {import('webpack').Configuration} */
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    // static: path.resolve(__dirname, './client/dist'),
    hot: true,
    client: {
      logging: "error",
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  entry: {
    index: "./client/src/index.ts"
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/src/index.html"
    }),
    new MiniCssExtractPlugin(),
  ],
  experiments: {
    futureDefaults: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
        ]
      }
    ]

  }
};
