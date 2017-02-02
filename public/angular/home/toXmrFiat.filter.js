angular.module('angularModule')
.filter('toXmrFiat', ['currencyHelper', '$filter', function(ch, $f) {
  function filter(input, fiat=true, ts=undefined, atomic=true) {
    input = ch.toNearestAtom(input);

    if (atomic)
      input = ch.fromAtomic(input);

    if (!fiat)
      return input + " XMR"

    try {
      return $f('currency')(ch.xmrToFiat(input, ts));
    }
    catch(e) {
      return undefined;
    }
  }
  filter.$stateful = true;
  return filter;
}]);
