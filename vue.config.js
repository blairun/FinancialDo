// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin
// const TerserPlugin = require("terser-webpack-plugin");
// const webpack = require("webpack")
const fs = require('fs')

module.exports = {
  // devServer: {
  //   port: 9998,
  //   // defaults to 8080
  //   https: {
  //     key: fs.readFileSync('../certs/localhost+1-key.pem'),
  //     cert: fs.readFileSync('../certs/localhost+1.pem'),
  //   },
  // },
  configureWebpack: {
    // optimization: {
    //   splitChunks: {
    //     minSize: 10000,
    //     maxSize: 250000,
    //   },
    //   // minimize: true,
    //   // minimizer: [new TerserPlugin()],
    // },
    // plugins: [
    //   new BundleAnalyzerPlugin(),
    //   // new webpack.ProvidePlugin({ _: "underscore" }),
    // ],
    module: {
      rules: [
        // {
        //   test: /\.ejs$/,
        //   loader: "ejs-loader",
        //   options: {
        //     esModule: false
        //   }
        // },
        {
          test: /\.md$/i,
          loader: 'raw-loader',
        },
      ],
    },
  },
}

// Code above minimizes this warning largely caused by bootstrap icons and chartjs libraries
// See also
// https://github.com/vuejs-templates/webpack/issues/1297
// https://medium.com/js-dojo/how-to-reduce-your-vue-js-bundle-size-with-webpack-3145bf5019b7

// WARNING  Compiled with 2 warnings                                                                                                               12:18:28 PM

// warning

// asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
// This can impact web performance.
// Assets:
//  js/chunk-vendors.a657d6d2.js (1.65 MiB)

// warning

// entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
// Entrypoints:
//  app (1.89 MiB)
//      css/chunk-vendors.3a6c5b3b.css
//      js/chunk-vendors.a657d6d2.js
//      css/app.49b30746.css
//      js/app.f4e59bbf.js

//  File                                   Size              Gzipped

//  dist/js/chunk-vendors.a657d6d2.js      1693.93 KiB       442.88 KiB
//  dist/js/app.f4e59bbf.js                35.30 KiB         9.83 KiB
//  dist/js/about.0d032535.js              9.97 KiB          3.41 KiB
//  dist/css/chunk-vendors.3a6c5b3b.css    210.24 KiB        30.75 KiB
//  dist/css/about.f60c3cfb.css            0.60 KiB          0.32 KiB
//  dist/css/app.49b30746.css              0.05 KiB          0.06 KiB
