const path = require('path')

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: __dirname, //path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      // {
      //   test: /\.css$/,  
      //   include: /node_modules/,  
      //   loaders: ['style-loader', 'css-loader'],
      // }
      // {
      //   test: /\.css$/i,
      //   loader: ['style-loader', 'css-loader']
      // }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
};
