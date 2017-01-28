angular.module('angularModule')
.controller('homeCtrl', [
  'pricesDB',
  'wallet',
  'currencyHelper',
  '$rootScope',
  '$mdDialog',
  '$mdToast',
function homeController(_pricesDB, _wallet, currencyHelper, $rootScope, $mdDialog, $mdToast) {
  var vm = this;
  window.vm = vm;

  vm.pricesDB = _pricesDB;
  vm.wallet = _wallet;

  vm.fp = false;
  vm.sendTX = new Transaction();

  vm.showDialog = showDialog;
  vm.hideDialog = hideDialog;
  vm.syncSendAmounts = syncSendAmounts;
  vm.confirmSend = confirmSend;
  vm.sendFunds = sendFunds;

  vm.wallet.refresh();

  $rootScope.$on('tickerChange', $rootScope.$apply);

  function Transaction() {
    return {
      address: '',
      payment_id: '',
      amountFiat: '',
      amount: '', // NOTE: THIS WILL BE IN BASE UNITS (HUMAN READABLE),
      atomicAmount: 0, // calculated using amount
      mixin: 3
    }
  }

  function syncSendAmounts(useXmr) {
    if (useXmr) {
      vm.sendTX.amountFiat = currencyHelper.xmrToFiat(vm.sendTX.amount);
    }
    else {
      vm.sendTX.amount = currencyHelper.fiatToXmr(vm.sendTX.amountFiat);
    }
  }

  function confirmSend() {
    if (vm.sendForm.$valid)
      showDialog('#confirm-send-dialog', false);
  }

  function sendFunds() {
    vm.sendTX.atomicAmount = currencyHelper.toAtomic(vm.sendTX.amount);
    vm.wallet.transfer(vm.sendTX).then((res) => {
      hideDialog();
      showToast('sent funds successfully!');
      vm.sendTX = new Transaction();
      vm.wallet.refresh();
    }).catch((res) => {
      var err = res.data.error;
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
    $mdToast.show($mdToast.simple().textContent(text));
  }
}]);
