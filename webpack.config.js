module.exports={
  context: __dirname + "/src",
  entry: "./clockmap",
  output:{
    filename:"app.js",
    path:__dirname+"/dist"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
