/**
 * 配置该文件可以参考:
 * https://cli.vuejs.org/zh/config/#%E7%9B%AE%E6%A0%87%E6%B5%8F%E8%A7%88%E5%99%A8
 *
 */
const url = "http://gateway:10000"
// 基础路径，发布前修改这里,当前配置打包出来的资源都是相对路径
const wsUrl = "http://gateway:10000"
let path = "jvs-ui";
const CompressionPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|json|txt|html|ico|svg)(\?.*)?$/i;
module.exports = {
  //项目路径地址
  publicPath: "/",
  //静态资源文件地址
  assetsDir: path + "/static",
  //静太资源文件
  indexPath: path + "/index.html",
  outputDir: 'docker/dist',
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // 忽略的打包文件
    config.externals({
      axios: "axios"
    });
    // const entry = config.entry("app");
    // entry.add("babel-polyfill").end();
    // entry.add("classlist-polyfill").end();
  },
  // 配置转发代理
  devServer: {
    port: 8088,
    disableHostCheck: true,
    proxy: {
      "^/get": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/get": "/get"
        }
      },
      "^/auth": {
        target: url,
        ws: true,
        changeOrigin: true,
        logLevel: "debug",
        pathRewrite: {
          "^/auth": "/auth"
        }
      },
      "^/mgr": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/mgr": "/mgr"
        }
      },
      "^/icon": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/icon": "/icon"
        }
      },
      "/im": {
        target: 'wss://'+wsUrl,
        ws: true,
        changeOrigin: true,
        logLevel: 'debug',
        secure: false,
        pathRewrite: {
          "^/im": ""
        }
      },
      "/gateway": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/gateway": "/gateway"
        }
      },
      "/static": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/static": "/static"
        }
      },
      "^/api": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/api": "/api"
        }
      },
      "^/agreement": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/agreement": "/agreement"
        }
      },
      "^/icon": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/icon": "/icon"
        }
      },
    }
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"  v8以下使用 additionalData
        prependData: `@import "~@/styles/themes/index.scss"`
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: `@import "~@/styles/themes/index.scss";`
      }
    }
  }
};
