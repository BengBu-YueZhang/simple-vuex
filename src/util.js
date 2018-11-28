export function clone(Fn) {
  var that = Fn
  var temp = function temporary() { return that.apply(Fn, arguments) }
  for (var key in Fn) {
    if (Fn.hasOwnProperty(key)) {
      temp[key] = Fn[key]
    }
  }
  return temp
}