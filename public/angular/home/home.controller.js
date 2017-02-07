angular.module('angularModule')
.controller('homeCtrl', [
  'pricesDB',
  'wallet',
  'currencyHelper',
  'openAlias',
  '$scope',
  '$q',
  '$interval',
  '$mdDialog',
  '$mdToast',
function homeController(_pricesDB, _wallet, currencyHelper, openAlias, $scope, $q, $interval, $mdDialog, $mdToast) {
  var vm = this;
  window.vm = vm;
  vm.debounce = 500;

  vm.pricesDB = _pricesDB;
  vm.wallet = _wallet;

  vm.pricesDB.loadTicker();
  vm.wallet.refresh();

  $interval(() => {
    vm.wallet.refresh();
    vm.pricesDB.loadTicker();
  }, 30000);

  vm.showIntegrated = true;
  vm.recTX = new IncomingTransaction();
  vm.sendTX = new OutgoingTransaction();
  vm.visTX = null;
  vm.fp = false;

  vm.showDialog = showDialog;
  vm.hideDialog = hideDialog;
  vm.confirmSend = confirmSend;
  vm.sendFunds = sendFunds;
  vm.showTXInfo = showTXInfo;

  function Transaction() {
    this.amountFiat = '';
    this.amount = '';
    this.atomicAmount = 0;

    this.syncAmounts = function(useXmr) {
      if (useXmr)
        this.amountFiat = currencyHelper.xmrToFiat(this.amount);
      else
        this.amount = currencyHelper.fiatToXmr(this.amountFiat);
      this.atomicAmount = currencyHelper.toAtomic(this.amount);
    }
  }

  function OutgoingTransaction() {
    Transaction.call(this);
    this.destination = '';
    this.paymentId = '';
    this.mixin = 3;
    this.usingAlias = false;
    this.address = '';

    this.loadAddress = function() {
      this.usingAlias = false;
      if (vm.sendTX.destination.indexOf('.') != -1) {
        return openAlias(this.destination)
          .then((data) => {
            console.log(data);
            this.address = data.result.recipient_address;
            this.usingAlias = Boolean(this.address);
            if (this.usingAlias) return $q.resolve();
            else return $q.reject();
          })
          .catch((data) => {
            return $q.reject();
          });
      }
      else {
        this.address = this.destination;
        return $q.resolve();
      }
    }
  }

  function IncomingTransaction() {
    Transaction.call(this);
    this.address = '';
    this.paymentId = '';
    this.integAddr = '';
    this.name = '';
    this.description = '';
    this.uri = '';

    this.newID = function() {
      vm.wallet.makeIntegratedAddress()
        .then((data) => {
          this.integAddr = data.result.integrated_address;
          return vm.wallet.splitIntegratedAddress(this.integAddr);
        })
        .then((data) => {
          this.address = data.result.standard_address;
          this.paymentId = data.result.payment_id;
          return this.makeUri();
        });
    }

    this.makeUri = function() {
      vm.wallet.makeUri(this)
        .then((data) => {
          this.uri = data.result.uri;
        });
    }

    this.newID();
  }


  function confirmSend() {
    if (vm.sendForm.$valid) {
      vm.sendTX.loadAddress()
        .then(() => {
          showDialog('#confirm-send-dialog', false);
        })
        .catch(() => {
          showToast('Unable to resolve alias: ' + vm.sendTX.destination);
        });
    }
  }

  function sendFunds() { // TODO: show tx_key to user
    vm.wallet.transfer(vm.sendTX)
      .then((data) => {
        hideDialog();
        showToast('sent funds! - tx_key: ' + data.result.tx_key);
        vm.sendTX = new Transaction();
        return vm.wallet.refresh();
      })
      .catch((data) => {
        var err = data.error;
        console.error(err);
        showToast('Ecode ' + err.code + ': ' + err.message);
        showDialog('#send-dialog');
      });
  }


  function showDialog(selector, clickOutsideToClose=true) {
    $mdDialog.show({
      contentElement: selector,
      parent: angular.element(document.body),
      clickOutsideToClose: clickOutsideToClose
    });
  }
  function hideDialog() {
    $mdDialog.hide();
  }

  function showToast(text) {
    $mdToast.show($mdToast.simple().textContent(text), {
      hideDelay: 10000
    });
  }

  function showTXInfo(tx) {
    vm.visTX = tx;
    showDialog('#tx-info-dialog');
  }
}]);
