angular.module('angularModule')
.filter('atomicToXmrFiat', ['currencyHelper', '$filter', function(ch, $f) {
  function filter(input, fiat=true) {
    input = ch.fromAtomic(input);

    if (!fiat)
      return input + " XMR"

    try {
      return $f('currency')(ch.xmrToFiat(input));
    }
    catch(e) {
      return undefined;
    }
  }
  filter.$stateful = true;
  return filter;
}]);
