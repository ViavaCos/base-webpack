// webpack配置文件使用commonjs的模块化
const { resolve } = require('path') // 引入resolve方法
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
                use: [MiniCssExtractPlugin.loader, 'css-loader'] // 多个loader使用use, 以数组形式配置
            },
            { // 配置解析less文件
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
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
    mode: 'development' // 打包模式 development-开发模式 production-生产模式
}