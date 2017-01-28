angular.module('angularModule')
.service('poloniex', ['modifyHttpPromise', '$http',
function(modifyHttpPromise, $http) {
  var endpoint = 'https://poloniex.com/public';

  function returnChartData(pair, ts) {
    return request({
      command: 'returnChartData',
      currencyPair: pair,
      start: ts - 1000,
      end: ts + 1000,
      period: 300
    });
  }
  function returnTicker() {
    return request({command: 'returnTicker'});
  }

  // private
  function request(params) {
    return modifyHttpPromise($http.get(endpoint, {
      params: params
    }));
  }

  return {
    returnChartData: returnChartData,
    returnTicker: returnTicker
  }
}]);
