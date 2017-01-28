angular.module('angularModule')
.service('pricesDB', ['$rootScope', 'poloniex', function($rootScope, poloniex) {
  var pair;
  var db;
  var ticker;

  pair = 'USDT_XMR';
  db = JSON.parse(localStorage.getItem('prices')) || {};
  setPair(pair);
  loadTicker();

  function getPair() {
    return pair;
  }
  function setPair(p) {
    if (ticker && !(p in ticker)) {
      console.warn('Currency pair [' + p + '] does not exist, keeping [' + pair + ']');
      return;
    }
    if (!(p in db))
      db[p] = {};
    pair = p;
  }

  function loadTicker() {
    poloniex.returnTicker().then((res) => {
      ticker = res.data;
      $rootScope.$broadcast('tickerChange');
    });
  }
  function getCurrentPrice() {
    return ticker[pair].last;
  }
  function getPrice(ts) {
    var relevant = db[pair];

    if (!(ts in relevant)) {
      loadPrice(ts);
      relevant[ts] = undefined; // prevent infdig
    }
    return relevant[ts];
  }

  //private
  function loadPrice(ts) {
    poloniex.returnChartData(pair, ts).then((res) => {
      db[pair][ts] = res.data[0].weightedAverage;
      saveToLS();
    });
  }
  function saveToLS() {
    console.log('saving to localStorage');
    localStorage.setItem('prices', JSON.stringify(db));
  }

  return {
    getPair: getPair,
    setPair: setPair,
    loadTicker: loadTicker,
    getCurrentPrice: getCurrentPrice,
    getPrice: getPrice
  }
}]);
