var exec = require('child_process').exec;
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
  exec('monerod --rpc-bind-port ' + mtc.daemonPort, onExit);
  return portPromise(mtc.daemonPort);
}

exports.startWallet = function() {
  exec('monero-wallet-rpc --log-file ./log/monero-wallet-cli.log' +
    ' --rpc-bind-port ' + mtc.walletPort +
    ' --wallet-file ' + config.wallet.file +
    ' --password ' + config.wallet.password,
    onExit
  );
  return portPromise(mtc.walletPort);
}
