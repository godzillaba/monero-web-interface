angular.module('angularModule')
.service('currencyHelper', ['pricesDB', function(pdb) {
  const ATOMIC_SIZE = Math.pow(10, 12);

  function toNearestAtom(x) {
    return Math.round(x*ATOMIC_SIZE)/ATOMIC_SIZE;
  }

  function toAtomic(x) {
    return x*ATOMIC_SIZE;
  }
  function fromAtomic(x) {
    return x/ATOMIC_SIZE;
  }

  function xmrToFiat(amt, ts=undefined) {
    var price = ts ? pdb.getPrice(ts) : pdb.getCurrentPrice();
    return amt*price;
  }
  function fiatToXmr(amt, ts=undefined) {
    var price = ts ? pdb.getPrice(ts) : pdb.getCurrentPrice();
    return amt/price;
  }

  return {
    toNearestAtom: toNearestAtom,
    toAtomic: toAtomic,
    fromAtomic: fromAtomic,
    xmrToFiat: xmrToFiat,
    fiatToXmr: fiatToXmr
  }

}]);
