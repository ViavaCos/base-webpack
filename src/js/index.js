import '../css/index.css'
import '../css/test.less'

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