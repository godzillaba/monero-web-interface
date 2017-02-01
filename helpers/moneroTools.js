var exec = require('child_process').exec;
var util = require('util');
var portUsed = require('tcp-port-used');
var config = require('config');
var mtc = config.moneroTools;

function onExit(error, stdout, stderr) {
  if (error) {
    console.error("Command failed with exit code " +
      error.code + ": " + error.cmd);
    process.exit();
  }
}

function portPromise(port) {
  return new Promise((res, rej) => {
    portUsed.waitUntilUsed(port, 200, mtc.startTimeout)
      .then(res)
      .catch(rej);
  });
}

exports.startDaemon = function() {
  var cmd = 'monerod --rpc-bind-port %s %s';
  exec(util.format(cmd, mtc.daemonPort, mtc.daemonArgs), onExit);
  return portPromise(mtc.daemonPort);
}

exports.startWallet = function() {
  var cmd = 'monero-wallet-rpc --log-file ./log/monero-wallet-rpc.log \
    --rpc-bind-port %s --wallet-file %s --password %s %s';

  exec(util.format(
    cmd, mtc.walletPort, config.wallet.file, config.wallet.password, mtc.walletArgs
  ), onExit);
  return portPromise(mtc.walletPort);
}
