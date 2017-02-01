angular.module('angularModule')
.service('wallet', ['moneroRpc', function(moneroRpc) {
  var address;
  var balance;
  var unlockedBalance;
  var transfers;
  // TODO: get rid of getters/setters - like Transaction
  function walletRpc(method, params) {
    return moneroRpc('wallet', method, params);
  }

  function loadAddress() {
    return new Promise(function(resolve, reject) {
      walletRpc('getaddress').then((data) => {
        address = data.result.address;
        resolve(data);
      }).catch(reject);
    });
  }


  function makeIntegratedAddress() {
    return walletRpc('make_integrated_address');
  }
  function splitIntegratedAddress(addr) {
    return walletRpc('split_integrated_address', {
      integrated_address: addr
    });
  }

  function loadBalance() {
    return new Promise(function(resolve, reject) {
      walletRpc('getbalance').then((data) => {
        balance = data.result.balance;
        unlockedBalance = data.result.unlocked_balance;
        resolve(data);
      }).catch(reject);
    });
  }
  function loadTransfers() {
    transfers = [];
    return new Promise(function(resolve, reject) {
      walletRpc('get_transfers', {
        in: true,
        out: true,
        pending: true,
        failed: true,
        pool: false // wt is pool?
      }).then((data) => {
        var r = data.result;
        for (var k in r) {
          for (var i=0; i < r[k].length; i++) {
            var t = r[k][i];
            t.transfer_type = k;
            t.total_amount = t.amount + (t.fee || 0);
            transfers.push(t);
          }
        }
        resolve(data);
      }).catch(reject);
    });
  }
  function transfer(tx) {
    return walletRpc('transfer', {
      destinations: [{
        amount: parseInt(tx.atomicAmount),
        address: tx.address
      }],
      mixin: parseInt(tx.mixin),
      payment_id: tx.paymentID,
      get_tx_key: true // wtf is this?!
    });
  }

  function makeUri(tx) {
    var params = {
      address: tx.integAddr,
      amount: parseInt(tx.atomicAmount) || null,
      recipient_name: tx.name || null,
      tx_description: tx.description || null
    }
    return walletRpc('make_uri', params);
  }

  function refresh() {
    return Promise.all([
      loadTransfers(),
      loadAddress(),
      loadBalance()
    ]);
  }

  function getAddress() { return address; }
  function getBalance() { return balance; }
  function getUnlockedBalance() { return unlockedBalance; }
  function getTransfers() { return transfers; }

  return {
    makeIntegratedAddress: makeIntegratedAddress,
    splitIntegratedAddress: splitIntegratedAddress,
    makeUri: makeUri,
    getAddress: getAddress,
    getBalance: getBalance,
    getUnlockedBalance: getUnlockedBalance,
    getTransfers: getTransfers,
    refresh: refresh,
    transfer: transfer
  }
}]);
