const appTitle = 'QR Camera';

// vue.config.js
module.exports = {
  // options...
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
