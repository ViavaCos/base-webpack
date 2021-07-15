// webpack配置文件使用commonjs的模块化
const { resolve } = require('path') // 引入resolve方法
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')

// deprecated eslint-loader@4.0.2: This loader has been deprecated. Please use eslint-webpack-plugin
// eslint-loader已经被抛弃了，改用eslint-webpack-plugin了
const EslintWebpackPlugin = require('eslint-webpack-plugin')

// 提取css通用配置
const commonLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {  // 配置css后处理器，自动处理css兼容性问题(如：添加css前缀等)
    // 兼容范围会读取package.json中的browserslist里配置的范围 
    // [官方git地址] https://github.com/browserslist/browserslist
    /**
        *   "browserslist": {
                "development": [
                    "last 10 chrome versions", // 最近10个chrome版本
                    "last 10 firefox versions",
                    "last 10 ie versions"
                ],
                "production": [
                    "> 0.2%", // 大于全球使用统计浏览器的 0.2%
                    "last 2 versions", // 最近2个浏览器版本
                    "not dead", // 排除已经死亡的浏览器
                    "not op_mini all" // 排除所有的Opera mini 浏览器
                ]
            }
        */
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [['postcss-preset-env']] // postcss预设环境, 会读取环境变量process.env.NODE_ENV的值
      }
    }            
  }
]

module.exports = {
  entry: './src/js/index.js', // 入口文件
  output: { // 出口文件
    filename: 'js/[name].js', // 文件名称
    path: resolve(__dirname, 'build'), // 文件路径
    // 【hash:8 --> 哈希值截取前8位】【ext --> 文件扩展名】
    assetModuleFilename: 'media/[hash:8][ext]' // 资源模块的命名规则(可包含文件路径)
  },
  module: { // loader配置集
    rules: [
      { // 配置解析css文件
        test: /\.css$/,
        use: [...commonLoader] // 多个loader使用use, 以数组形式配置
      },
      { // 配置解析less文件
        test: /\.less$/,
        use: [...commonLoader, 'less-loader']
      },
      { // 配置解析图片资源
        test: /\.(jpg|jpeg|png|gif)$/,
        /**
                 * 资源模块类型
                 * 1. asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现
                 * 2. asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现
                 * 3. asset/source 导出资源的源代码。之前通过使用 raw-loader 实现
                 * 4. asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现
                 */
        // 
        type: 'asset/resource' // 资源模块类型
      },
      { // 配置解析html文件中引入的资源 (配置后，引入的文件名将变成打包后文件的名称)
        test: /\.html$/,
        loader: 'html-loader', // 多个loader使用loader, 以字符串形式配置
        options: {
          minimize: true // 压缩 HTML, 生产模式下的默认值是true, 其它模式为false
        }
      },
      { // 配置解析js文件(js编译添加兼容性)
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'], // 预设环境
          // plugins: ['@babel/plugin-transform-runtime'],
          // presets: [
          //     [
          //         '@babel/preset-env',
          //         {
          //             useBuiltIns: 'entry',
          //             targets: {
          //                 chrome: "58",
          //                 ie: "8",
          //                 "browsers": ["last 2 versions", "ie >= 7"]
          //             }
          //         }
          //     ]
          // ]
        }
      }
    ]
  },
  plugins:[ // 插件配置集
    // 自动化配置：以指定模板创建html文件，并自动引入打包后的js文件
    new HtmlWebpackPlugin({
      template: './src/index.html', // 指定的html模板地址
      minify: {
        collapseWhitespace: true, // 折叠(去掉)空格
        // removeComments: true // 移除页面注释(html/js注释), 这项不配置也会移除
      }
    }),
    // 拆分css成单独的文件(该插件会为每个包含 CSS 的 JS 文件创建一个 CSS 文件)
    new MiniCssExtractPlugin({
      filename: 'css/[name].css' // css文件名称(可以包含文件路径)
    }),
    // 规范代码风格
    new EslintWebpackPlugin()
  ],
  optimization: { // 打包优化配置
    minimize: true, // 打包优化默认仅在 生产模式 下启用, 若要在 开发模式 也启用，需将此项设置为true
    minimizer: [ // 配置优化用到的插件
      new CssMinimizerWebpackPlugin() // 压缩css, 通webpack4使用的optimize-css-assets-webpack-plugin
    ],
    splitChunks: { // 代码分割
      chunks: 'all', // 设置所分割块的范围(all-所有 async-异步 initial-初始值)
      // chunks(chunk){ // 也可以通过设置chunks函数来排除某个chunk不做分割
      //   return chunk.name !== 'my-excluded-chunk'
      // },
      minSize: 50 * 1024, // 50kb, 生成chunk的最小体积(单位是bytes)
      maxSize: 200 * 1024, // bytes  将大于 maxSize 个字节的 chunk 分割成较小的部分,  这些较小的部分在体积上至少为 minSize
      minChunks: 2, // 拆分前必须共享模块的最小 chunks 数 (也就是这个包被引用的次数必须超过设置的值)
      maxAsyncRequests: 30, // 按需加载时的最大并行请求数
      hidePathInfo: false, // 阻止公开chunk路径信息
    },
    /*
      1. tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)
      2. 可以在package.json中配置哪些文件是有副作用的(不可以直接删除的)
         这样在进行tree-sharking的时候会跳过这些文件(打包速度就更快一些了)
         例如："sideEffects": ["*css", "*.less", "./src/js/large-js-file.js"]
      3. 如果所有的都是无副作用的代码，直接配置值为false就行
      4. 详情请看官网：https://webpack.docschina.org/guides/tree-shaking/#root
      5. 将mode设置为"production"将会自动开启tree-sharking并自动删除掉这些未引用的代码
    */
    usedExports: true // 开启tree-sharking， 不过仅仅只是会找出哪些代码是为被引用的，还需要额外配置(比如:terser插件)才可以删除无用代码
  },
  devServer: { // 开发环境服务器配置
    contentBase: resolve(__dirname, 'build'), // 编译后文件位置
    compress: true, // 开启gzip压缩
    port: 5555, // 端口号
    open: true, // 是否自动打开浏览器
    hot: true // 开启热更新(Hot Module Replacement)
  },
  mode: 'development' // 打包模式 development-开发模式 production-生产模式
}

/**
    todos:

    1. css/html/js 压缩
    2. css/js兼容性
    3. js代码规范
    4. 删除生产环境console/debugger， css/html注释
    5. 代码分割
    6. 开发环境优化

 */