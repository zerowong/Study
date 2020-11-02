const exec = require('child_process').exec
const async = require('async')

function downloadNodeVer(ver, destination, cb) {
  const url = `https://nodejs.org/dist/v${ver}/node-v${ver}.tar.gz`
  const filePath = `${destination}/${ver}.tgz`
  exec(`curl ${url} > ${filePath}`, cb)
}

async.series(
  [
    (callback) => {
      async.parallel(
        [
          (callback) => {
            console.log('Downloading Node v4.4.7...')
            downloadNodeVer('4.4.7', './tmp', callback)
          },
          (callback) => {
            console.log('Downloading Node v6.4.0...')
            downloadNodeVer('6.4.0', './tmp', callback)
          },
        ],
        callback
      )
    },
    (callback) => {
      console.log('Creating archive of download files...')
      exec('tar cvf ./tmp/node_distros.tar ./tmp/4.4.7.tgz ./tmp/6.4.0.tgz', (err) => {
        if (err) throw err
        console.log('All done')
        callback()
      })
    },
  ],
  (err, res) => {
    if (err) throw err
  }
)
