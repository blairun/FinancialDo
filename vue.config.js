module.exports = {
  configureWebpack: {
    module: {
      // parse markdown file for About page
      rules: [
        {
          test: /\.md$/i,
          loader: 'raw-loader',
        },
      ],
    },
  },
  // required to load local/relative images (rather than URLs)
  // https://bootstrap-vue.org/docs/reference/images#component-img-src-resolving
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-carousel-slide': 'img-src',
        }
        return options
      })
  },
}
