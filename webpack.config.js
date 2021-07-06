// webpack配置文件使用commonjs的模块化
const { resolve } = require('path') // 引入resolve方法
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: './src/js/index.js', // 入口文件
    output: { // 出口文件
        filename: 'js/built.js', // 文件名称
        path: resolve(__dirname, 'build') // 文件路径
    },
    module: { // loader配置集
        rules: [
            { // 配置解析css文件
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            { // 配置解析less文件
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
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