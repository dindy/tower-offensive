const path = require("path")
const webpack = require("webpack")
const env = process.env.NODE_ENV

let config = {
  mode: env || 'development',
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] }
        }
    }]
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    globalObject: 'this'
  },  
  node: {
    fs: 'empty',
  },
  plugins: []  
}

module.exports = (env, argv) => {
  if (env === 'development') {
    config.entry = ['webpack/hot/dev-server', "./src/index.js"] 
    config.devtool = 'inline-source-map'    
  } else {
    config.entry = ["./src/index.js"] 
  }
  return config
}
