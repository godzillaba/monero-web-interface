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
    var price;
    if (ts)
      price = pdb.getPrice(ts);
    else
      price = pdb.getCurrentPrice();
    return amt*price;
  }
  function fiatToXmr(amt, ts=undefined) {
    return 1/xmrToFiat(amt, ts);
  }

  return {
    toNearestAtom: toNearestAtom,
    toAtomic: toAtomic,
    fromAtomic: fromAtomic,
    xmrToFiat: xmrToFiat,
    fiatToXmr: fiatToXmr
  }

}]);
