/**
 * @param {any[]} arr
 * @param {function} callback
 */
function nativeMap(arr, callback) {
  return arr.map(callback)
}

/**
 * @param {any[]} arr
 * @param {function} callback
 */
function customMap(arr, callback) {
  const res = []
  for (let i = 0; i < arr.length; i++) {
    res.push(callback(arr[i], i, arr))
  }
  return res
}

/**
 * @param {number} times
 * @param {function} fn
 * @param {any[]} arr
 * @param {function} callback
 */
function run(times, fn, arr, callback) {
  const start = new Date().getTime()
  for (let i = 0; i < times; i++) {
    fn(arr, callback)
  }
  const end = new Date().getTime()
  console.log(`running ${fn.name} ${times} times cost ${end - start}ms`)
}

// test
function callback(item) {
  return item
}

const arr = [1, 2, 3, 4, 5, 6]

run(1000000, nativeMap, arr, callback)
run(1000000, customMap, arr, callback)
