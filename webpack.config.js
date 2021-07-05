// 使用commonjs的模块化

module.exports = {
    entry: './src/js/index.js', // 入口文件
    output: { // 出口文件
        filename: 'js/built.js', // 文件名称
        path: resolve(__dirname, 'build') // 文件路径
    },
    module: { // loader配置集
        rules: []
    },
    plugins:[], // 插件配置集
    mode: 'development' // 打包模式 development-开发模式 production-生产模式
}