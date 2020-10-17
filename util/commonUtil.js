export default {
  // * 通用得查找数组的某一项的函数
  findItem (arr, fn) {
    for (let i = 0; i < arr.length; i++) {
      if (fn.call(this, arr[i], i, arr)) {
        return {
          index: i,
          item: arr[i]
        }
      }
    }
    return {
      index: -1,
      item: null
    }
  },
  // * 通用的判断某个字符串是否以某个字段开头
  startsWith (fullStr, startStr) {
    return fullStr.indexOf(startStr) === 0
  },
  // * 判断传入的数据是否是对象
  isObject (o) {
    return Object.prototype.toString.call(o) === '[object Object]'
  }
}
