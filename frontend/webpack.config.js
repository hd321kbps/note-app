const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let conf = {
  mode: 'development',
  context: __dirname,
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  devServer: {
    client: {
      overlay: true
    },
    static: ['dist'],
    watchFiles: ['dist/**/*'],
    open: true,
    hot: true,
    port: 3030,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.module\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]__[sha256:hash:base64:7]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']]
              }
            }
          }
        ],
        exclude: '/node_modules/'
      },
      {
        test: /^((?!\.module).)*css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']]
              }
            }
          }
        ],
        exclude: '/node_modules/'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    })
  ]
};

module.exports = (env, options) => {
  let isProd = options.mode === 'production';
  conf.devtool = isProd ? false : 'eval-cheap-module-source-map';
  conf.target = isProd ? 'browserslist' : 'web';

  return conf;
};
