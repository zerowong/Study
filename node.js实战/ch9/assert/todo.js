class Todo {
  constructor() {
    this.todos = []
  }

  add(item) {
    this.todos.push(item)
  }

  deleteAll() {
    this.todos.length = 0
  }

  get length() {
    return this.todos.length
  }

  doAsync(cb) {
    setTimeout(cb, 2000, true)
  }
}

module.exports = Todo
