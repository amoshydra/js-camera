const appTitle = 'QR Camera';

// vue.config.js
module.exports = {
  // Allow public path to be configured to suit different deployment environment
  publicPath: process.env.BUILD_PUBLIC_PATH,

  devServer: {
    disableHostCheck: true
  },

  pwa: {
    name: appTitle,
  },

  chainWebpack: config => {

    config
      .plugin('html')
      .tap(([ htmllWebpackPluginOption ]) => {

        htmllWebpackPluginOption.title = appTitle;
        return [ htmllWebpackPluginOption ]
      })
  }
}
