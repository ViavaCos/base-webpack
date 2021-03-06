import '../css/index.css'
import '../css/test.less'

import { cube } from './math.js'

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

// 下面这行代码会报错
console.log(text());

console.log(add(1, 2));

function component(){
  const element = document.createElement('pre')
  element.innerHTML = [
    'Hi, webpack!',
    '3 的立方是',
    cube(3)
  ].join('\n\n')

  return element
}
document.body.appendChild(component())