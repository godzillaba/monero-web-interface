angular.module('angularModule')
.service('wallet', ['moneroRpc', function(moneroRpc) {
  var address;
  var balance;
  var unlockedBalance;
  var transfers;

  function walletRpc(method, params) {
    return moneroRpc('wallet', method, params);
  }

  function loadAddress() {
    walletRpc('getaddress').then((res) => {
      address = res.data.result.address;
    });
  }

  function fetchIntegratedAddress() {
    var ans = {};
    return new Promise(function(resolve, reject) {
      walletRpc('make_integrated_address').then((res) => {
        ans.address = res.data.result.integrated_address;

        walletRpc('split_integrated_address', {
          integrated_address: ans.address
        }).then((res) => {

          ans.paymentID = res.data.result.payment_id;
          resolve(ans);

        }).catch(reject);

      }).catch(reject);

    });
  }

  function loadBalance() {
    walletRpc('getbalance').then((res) => {
      balance = res.data.result.balance;
      unlockedBalance = res.data.result.unlocked_balance;
    });
  }
  function loadTransfers() {
    transfers = [];
    walletRpc('get_transfers', {
      in: true,
      out: true,
      pending: true,
      failed: true,
      pool: false // wt is pool?
    }).then((res) => {
      var r = res.data.result;
      for (var k in r) {
        for (var i=0; i < r[k].length; i++) {
          var t = r[k][i];
          t.transfer_type = k;
          t.total_amount = t.amount + (t.fee || 0);
          transfers.push(t);
        }
      }
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
    loadAddress();
    loadBalance();
    loadTransfers();
  }

  function getAddress() { return address; }
  function getBalance() { return balance; }
  function getUnlockedBalance() { return unlockedBalance; }
  function getTransfers() { return transfers; }


  return {
    fetchIntegratedAddress: fetchIntegratedAddress,
    makeUri: makeUri,
    getAddress: getAddress,
    getBalance: getBalance,
    getUnlockedBalance: getUnlockedBalance,
    getTransfers: getTransfers,
    refresh: refresh,
    transfer: transfer
  }
}]);
