const fs = require('fs').promises

class _WordCount {
  tasks = []
  wordCountMap = new Map()
  targetDir = ''
  resultFile = './result.txt'
  completedTask = 0

  constructor() {}

  check() {
    this.completedTask += 1
    if (this.completedTask === this.tasks.length) {
      let res = ''
      for (let [key, value] of this.wordCountMap) {
        res += `${key} : ${value}\n`
      }
      fs.open(this.resultFile, 'w').then((file) => {
        file.write(res)
        file.close()
      })
      this.complete()
    }
  }

  addCount(word) {
    const wc = this.wordCountMap
    wc.has(word) ? wc.set(word, wc.get(word) + 1) : wc.set(word, 1)
  }

  countWordInText(text) {
    const words = text.toString().toLowerCase().split(/\W+/).sort()
    for (let i = 0, l = words.length; i < l; i++) {
      if (words[i]) this.addCount(words[i])
    }
  }

  async genTask() {
    const files = await fs.readdir(this.targetDir)
    for (let i = 0; i < files.length; i++) {
      const task = ((file) => {
        return () => {
          const filename = file.split('/').pop()
          fs.readFile(file)
            .then((data) => {
              this.countWordInText(data)
              this.check()
              console.log(`${filename}  ${'\u2714'}`)
            })
            .catch(() => console.error(`${filename}  ${'\u2718'}`))
        }
      })(`${this.targetDir}/${files[i]}`)
      this.tasks.push(task)
    }
  }

  complete() {
    this.tasks.length = 0
    this.completedTask = 0
    this.wordCountMap.clear()
  }

  count(path) {
    this.targetDir = path
    this.genTask().then(() => {
      this.tasks.forEach((task) => task())
    })
  }
}

const _wordCount = new _WordCount()

class WordCount {
  constructor() {}

  count(path) {
    _wordCount.count(path)
  }
}

module.exports = WordCount
