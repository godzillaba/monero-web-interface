angular.module('angularModule')
.service('wallet', ['moneroRpc', '$q', function(moneroRpc, $q) {
  var address;
  var balance;
  var unlockedBalance;
  var transfers;

  function walletRpc(method, params) {
    return moneroRpc('wallet', method, params);
  }

  function loadAddress() {
    return walletRpc('getaddress').then((data) => {
        address = data.result.address;
        return data;
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
    return walletRpc('getbalance')
      .then((data) => {
        balance = data.result.balance;
        unlockedBalance = data.result.unlocked_balance;
        return data;
      });
  }
  function loadTransfers() {
    transfers = [];

    function snakeToCamel(s) {
      return s.replace(/_\w/g, function(m) {
        return m[1].toUpperCase();
      });
    }

    function camelizeTx(tx) {
      var ctx = {};
      for (var attr in tx) {
        ctx[snakeToCamel(attr)] = tx[attr];
      }
      return ctx;
    }

    return walletRpc('get_transfers', {
        in: true,
        out: true,
        pending: true,
        failed: true,
        pool: false // wt is pool?
      })
      .then((data) => {
        var result = data.result;
        for (var type in result) {
          for (var i=0; i < result[type].length; i++) {
            var tx = camelizeTx(result[type][i]);
            tx.txType = type;
            tx.totalAmount = tx.amount + (tx.fee || 0);
            transfers.push(tx);
          }
        }
        return data;
      });
  }
  function transfer(tx) {
    return walletRpc('transfer', {
      destinations: [{
        amount: parseInt(tx.atomicAmount),
        address: tx.address
      }],
      mixin: parseInt(tx.mixin),
      payment_id: tx.paymentId,
      get_tx_key: true
    });
  }

  function setNote(txid, note) {
    return walletRpc('set_tx_notes', {
      txids: [txid],
      notes: [note]
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
    return $q.all([
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
    setNote: setNote,
    makeUri: makeUri,
    getAddress: getAddress,
    getBalance: getBalance,
    getUnlockedBalance: getUnlockedBalance,
    getTransfers: getTransfers,
    refresh: refresh,
    transfer: transfer
  }
}]);
