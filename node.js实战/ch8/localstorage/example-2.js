function getKeys(namespace = '') {
  if (namespace !== '') {
    return Object.keys(localStorage).filter((key) => key.startsWith(namespace))
  }
  return Object.keys(localStorage)
}

function getVals(keys) {
  const vals = []
  for (let i = 0, l = keys.length; i < l; i++) {
    vals.push(localStorage.getItem(keys[i]))
  }
  return vals
}

function getObj(namespace = '') {
  const obj = {}
  const keys = getKeys(namespace)
  const vals = getVals(keys)
  for (let i = 0, l = keys.length; i < l; i++) {
    obj[keys[i]] = JSON.parse(vals[i])
  }
  return obj
}

function getKVPairs(namespace = '') {
  const pairs = []
  const keys = getKeys(namespace)
  const vals = getVals(keys)
  for (let i = 0, l = keys.length; i < l; i++) {
    pairs.push({ key: keys[i], value: JSON.parse(vals[i]) })
  }
  return pairs
}

const user1 = {
  name: 'zerowong',
  age: 21,
  single: true,
}

const usre2 = {
  name: 'someone',
  age: 0,
  single: true,
}

const post1 = {
  id: 1,
  content: 'something',
}

const post2 = {
  id: 2,
  content: 'something',
}

localStorage.setItem(`/user/${user1.name}`, JSON.stringify(user1))
localStorage.setItem(`/user/${usre2.name}`, JSON.stringify(usre2))
localStorage.setItem(`/post/${post1.id}`, JSON.stringify(post1))
localStorage.setItem(`/post/${post2.id}`, JSON.stringify(post2))

const users = getObj('/user')
const posts = getObj('/post')
console.log(users)
console.log(posts)

const _users = getKVPairs('/user')
const _posts = getKVPairs('/post')
console.log(_users)
console.log(_posts)
