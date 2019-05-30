module.exports = function elmServe (opts) {
  // const supervisor = require('supervisor')
  const path = require('path')
  const os = require('os')
  const clc = require('cli-color')
  const elmReloadServer = require('./elm-reload-server')

  const runFile = path.join(
    os.tmpdir(),
    'reload-' +
      Math.random()
        .toString()
        .slice(2)
  )

  if (opts.proxyPrefix && !opts.proxyPrefix.startsWith('/')) {
    opts.proxyPrefix = opts.proxyPrefix + '/'
  }

  if ((opts.proxyPrefix && !opts.proxyHost) || (opts.proxyHost && !opts.proxyPrefix)) {
    throw new Error('If either `--proxyPrefix` and `--proxyHost` is given, the other must be as well')
  }

  console.log('\nReload web server:')
  console.log('  - Website URL: ' + clc.blue.bold((opts.ssl ? 'https://' : 'http://') + (opts.host || 'localhost') + ':' + (opts.port || 1234)))
  console.log('  - Listening on port: ' + clc.cyan.bold(opts.port || 1234))
  if (opts.proxyPrefix && opts.proxyHost) {
    console.log('proxying requests starting with ' + clc.green(opts.proxyPrefix) + ' to ' + clc.green(opts.proxyHost))
  }

  var args2 =
    [opts.port || 1234,
      opts.dir || process.cwd(),
      opts.open || false, // Open Browser
      opts.host || 'localhost',
      runFile,
      opts.startPage || 'index.html',
      opts.pushstate || false,
      false, // Verbose
      opts.proxyPrefix || false,
      opts.proxyHost || false,
      opts.ssl || false]

  const ers = elmReloadServer(args2)
  const server = ers.startServer()
  return {
    sendMessage: server.sendMessage
  }
}