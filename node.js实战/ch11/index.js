#!/usr/bin/env node
const fs = require('fs')
const yargs = require('yargs')
const concat = require('concat-stream')

const argv = yargs
  .usage('parse-json [options]')
  .help('h')
  .alias('h', 'help')
  .demandOption('f')
  .nargs('f', 1)
  .describe('JSON file to parse').argv

const file = argv.f

function parse(str) {
  const value = JSON.parse(str)
  console.log(JSON.stringify(value))
}

if (file === '-') {
  process.stdin.pipe(concat(parse))
} else {
  fs.readFile(file, (err, data) => {
    if (err) throw err
    parse(data.toString())
  })
}
