const HtmlWebPackPlugin = require('html-webpack-plugin'); // installed via npm
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, args) => {
  let resolveImages = path.resolve(__dirname, './images/default');
  let resolveIcon = path.resolve(__dirname, 'public/helixSenseLogo.png');
  let iconPath = 'public/';
  if ((env && env.CLIENT_NAME) === 'sfx') {
    resolveImages = path.resolve(__dirname, './images/sfx/light-images');
    resolveIcon = path.resolve(__dirname, 'public/sfx/favicon.ico');
    iconPath = 'public/sfx/';
  }

  const basePath = (env && env.REACT_APP_BASE_PATH) || '/';

  const appMode = args && args.mode ? args.mode : 'development';

  const defaultplugins = [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      favicon: resolveIcon,
      inject: 'body', // Inject JS scripts into the body
      templateParameters: {
        BASE_PATH: basePath, // Pass BASE_PATH to the HTML template
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/serviceWorker.js',
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}v3index.html`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}manifest.json`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}favicon-16x16.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}favicon-32x32.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}android-icon-36x36.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}android-icon-48x48.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}android-icon-72x72.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}android-icon-96x96.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}android-icon-144x144.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}android-icon-192x192.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}apple-icon-152x152.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
        {
          from: `${iconPath}android-icon-512x512.png`,
          to({ context, absoluteFilename }) {
            return Promise.resolve('[name].[ext]');
          },
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        TARGET_ENV: JSON.stringify(appMode),
        NODE_ENV: JSON.stringify(appMode),
        CLIENT_NAME: JSON.stringify(env && env.CLIENT_NAME ? env.CLIENT_NAME : 'default'),
        REACT_APP_BASE_PATH: JSON.stringify(env && env.REACT_APP_BASE_PATH ? env.REACT_APP_BASE_PATH : '/'),
      },
    }),
    new CaseSensitivePathsPlugin(),
  ];

  return {
    context: __dirname,
    entry: './src/index.jsx',
    mode: appMode,
    output: {
      path: basePath && basePath.includes('/v3') ? path.resolve(__dirname, 'v3', 'dist') : path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      publicPath: basePath || '/', // Fallback to root if undefined
    },
    stats: 'minimal',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: [{
            loader: 'babel-loader',
            options: {
              plugins: ['lodash'],
              presets: [
                ['@babel/env', { targets: { node: 6 } }],
              ],
            },
          }],
        },
        {
          test: /\.less$/,
          use: [
            appMode === 'production'
              ? MiniCssExtractPlugin.loader // Extract CSS for production
              : 'style-loader', // Use style-loader in development
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2, // Ensures LESS is processed properly
                modules: false, // Disable CSS Modules for antd
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true, // Required for Ant Design
                  modifyVars: {
                    '@primary-color': '#1890ff', // Example: Customize Ant Design theme
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.(css|scss)$/i,
          use: [
            appMode === 'production'
              ? MiniCssExtractPlugin.loader // Extract CSS for production
              : 'style-loader', // Use style-loader for dev (faster)
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(jpg|jpeg|png|svg|webp|ico|xlsx)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: './images',
                name: '[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource', // Use Asset Modules in Webpack 5
          generator: {
            filename: 'fonts/[name][hash][ext]', // Output path and filename pattern
          },
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      alias: {
        '@src': path.resolve(__dirname, 'src/'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@images': resolveImages,
        '@middleware': path.resolve(__dirname, 'src/app/middleware'),
        '@shared': path.resolve(__dirname, 'src/app/shared'),
        '@util': path.resolve(__dirname, 'src/app/util'),
      },
      fallback: {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      },
    },
    devServer: {
      compress: true,
      historyApiFallback: {
        index: `${basePath}index.html`, // This is the fallback for `/v3/*` routes
      },
      port: 3010,
      static: {
        directory: path.join(__dirname, 'dist'), // Static files directory
      },
      hot: true,
      headers: appMode === 'development'
        ? { 'Cache-Control': 'no-store' } // Disable caching in development
        : { 'Cache-Control': 'public, max-age=3600, must-revalidate' }, // Enable caching in production
      client: {
        overlay: appMode === 'development',
      },
    },
    optimization: {
      minimize: appMode === 'production',
      minimizer: [
        new TerserPlugin({
          parallel: true, // Use multi-core processing
          terserOptions: {
            compress: {
              drop_console: true, // Remove console logs
              drop_debugger: true,
            },
            output: {
              comments: false, // Remove comments
            },
          },
        }),
      ],
      runtimeChunk: false,
      mergeDuplicateChunks: false,
    },
    plugins: appMode !== 'development'
      ? [...defaultplugins,
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css', // Cache-busting
          chunkFilename: '[id].[contenthash].css',
        })]
      : [...defaultplugins],
  };
};