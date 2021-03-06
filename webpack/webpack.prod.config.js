const path = require('path')
const webpack = require('webpack');
const config = require('./webpack.base.config');
const UglifyJsPlugin = require("webpack/lib/optimize/UglifyJsPlugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

config.devtool= false;

config.entry = {
  'main': ['./src/client.js'],
  vendor: [
            'jquery'
        ]
};

config.output= {
  path: path.join(__dirname, '..' ,'dist'),
  filename: 'assets/js/[name].js',
  chunkFilename: "assets/js/[id].js",
  // publicPath: 'http://localhost:8080/'
};

config.externals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'immutable': 'Immutable'
};

config.module= {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'es3ify',
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react', 'stage-0'],
        plugins: ['add-module-exports']
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract(
        'css?sourceMap&-minimize!' + 'postcss!' + 'less?sourceMap'
      )
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(
        'css?sourceMap&-minimize!' + 'postcss'
      )
    },
    { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/font-woff&name=/assets/fonts/[name].[ext]' },
    { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/font-woff&name=/assets/fonts/[name].[ext]' },
    { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=application/octet-stream&name=/assets/fonts/[name].[ext]' },
    { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&name=/assets/fonts/[name].[ext]' },
    { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&minetype=image/svg+xml&name=/assets/fonts/[name].[ext]' },
    { test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i, loaders: [
    'url?limit=10000&name=/assets/images/[name].[ext]',
    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'] }
    ]
  };
config.plugins = [
  new webpack.optimize.CommonsChunkPlugin('vendor', 'assets/js/vendor.js'),
  new ExtractTextPlugin('assets/css/[name].css',
    {
      disable: false,
      allChunks: true
    }),
  new UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: {
      except: ['$','jQuery']
    }
  }),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
  }),
  new webpack.DefinePlugin({
    __DEV__: false,
    __PRERELEASE__: true,
    'process.env.NODE_ENV': '"production"'
  }),
  new HtmlWebpackPlugin({
    title: 'React app',
    initialData: 'window.__INITIAL_STATE__ = <%- __state__ %>',
    filename: path.join(__dirname, '..', 'dist', 'index.ejs'),
    template: path.join(__dirname, '..', 'src', 'index.ejs'),
    hash: true,
    minify:{
      removeComments:false,
      collapseWhitespace:false
    }
  }),
  new TransferWebpackPlugin([
    {
      from: './src/assets/css/utils',
      to: './assets/css/utils'
    },
    {
      from: './src/assets/images',
      to: './assets/images'
    },
    {
      from: './src/assets/fonts',
      to: './assets/fonts'
    },
    {
      from: './src/utils',
      to: './assets/js/utils'
    }
  ])
];

module.exports = config;
