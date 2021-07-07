// webpack配置文件使用commonjs的模块化
const { resolve } = require('path') // 引入resolve方法
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')

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
        filename: 'js/built.js', // 文件名称
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
                loader: 'html-loader' // 多个loader使用loader, 以字符串形式配置
            }
        ]
    },
    plugins:[
        // 自动化配置：以指定模板创建html文件，并自动引入打包后的js文件
        new HtmlWebpackPlugin({
            template: './src/index.html' // 指定的html模板地址
        }),
        // 拆分css成单独的文件(该插件会为每个包含 CSS 的 JS 文件创建一个 CSS 文件)
        new MiniCssExtractPlugin({
            filename: 'css/[name].css' // css文件名称(可以包含文件路径)
        })
    ], // 插件配置集
    optimization: { // 打包优化配置
        minimize: true, // 打包优化默认仅在 生产模式 下启用, 若要在 开发模式 也启用，需将此项设置为true
        minimizer: [
            new CssMinimizerWebpackPlugin() // 压缩css, 通webpack4使用的optimize-css-assets-webpack-plugin
        ]
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