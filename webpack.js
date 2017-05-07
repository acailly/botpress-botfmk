var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals')
var pkg = require('./package.json')

var nodeConfig = {
  devtool: 'source-map',
  entry: ['./src/index.js'],
  output: {
    path: './bin',
    filename: 'node.bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals(), 'botpress'],
  target: 'node',
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['latest', 'stage-0'],
        plugins: ['transform-object-rest-spread', 'transform-async-to-generator']
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
}

var webConfig = {
  devtool: 'source-map',
  entry: ['./src/views/index.jsx'],
  output: {
    path: './bin',
    publicPath: '/js/modules/',
    filename: 'web.bundle.js',
    libraryTarget: 'assign',
    library: ['botpress', pkg.name]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['latest', 'stage-0', 'react'],
        plugins: ['transform-object-rest-spread', 'transform-decorators-legacy']
      }
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css?modules&importLoaders=1&localIdentName=' + pkg.name + '__[name]__[local]___[hash:base64:5]', 'sass']
    }, {
      test: /\.css$/,
      loaders: ['style', 'css']
    }, {
      test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
      loader: 'file?name=../fonts/[name].[ext]'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  }
}


var compiler = webpack([nodeConfig, webConfig])
var postProcess = function(err, stats) {
  if (err) throw err
  console.log(stats.toString('minimal'))
}

if (process.argv.indexOf('--compile') !== -1) {
  compiler.run(postProcess)
} else if (process.argv.indexOf('--watch') !== -1) {
  compiler.watch(null, postProcess)
}

module.exports = {
  web: webConfig,
  node: nodeConfig
}
