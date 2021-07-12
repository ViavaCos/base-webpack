import '../css/index.css'
import '../css/test.less'

// 充实一下js文件体积， 好多分出来一个chunk
import './large-js-file.js'

// todo: 寻找更为合适的方案，@babel/plugin-transform-runtime 尝试配置后，似乎未生效。
import 'babel-polyfill' // 可以将Promise编译为es5的语法(代价：引入巨多的兼容函数;多达几千行)

function add(x, y) {
  return x + y
}

/**
 * 配置了babel-loader后，
 * 如下代码中:
 *  1. const会编译为var
 *  2. 箭头函数会编译为普通函数
 * 
 *  问题：但是Promise还是Promise
 */
const p = new Promise(resollve => {
  resollve(add(6, 6))
})

// 解开下面这行注释，就可以看到eslint提示你需要使用单引号的报错
// const str = "Hi"


console.log(add(1, 2));