import '../css/index.css'
import '../css/test.less'

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


console.log(add(1, 2));