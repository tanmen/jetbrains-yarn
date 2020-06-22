#!/usr/bin/env node

var child_process = require('child_process')
var fs = require('fs')
var path = require('path')

child_process.exec('nodenv root', function(err, stdout, stderr) {
  var yarn

  // get shim path from `nodenv root` (respects $NODENV_ROOT)
  if(!err && stdout) {
    yarn = yarnShim(stdout.replace(/\n/g, ''))
  }

  // infer shim path if installed as nodenv plugin
  if (!yarn && path.basename(path.resolve(__dirname + '/../..')) === 'plugins') {
    yarn = yarnShim(path.resolve(__dirname + '/../../..'))
  }

  // fallback to yarn from PATH if not found thus far
  child_process
    .spawn(yarn || 'yarn', process.argv.slice(2), { stdio: 'inherit' })
    .on('close', process.exit)
})

function yarnShim(nodenvRoot) {
  var yarnShim = nodenvRoot + '/shims/yarn'
  if (fs.existsSync(yarnShim)) return yarnShim
}
