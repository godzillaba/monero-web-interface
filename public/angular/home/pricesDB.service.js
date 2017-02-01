angular.module('angularModule')
.service('pricesDB', ['poloniex', function(poloniex) {
  var pair;
  var db;
  var ticker;

  pair = 'USDT_XMR';
  db = JSON.parse(localStorage.getItem('prices')) || {};
  setPair(pair);

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
    return new Promise((resolve, reject) => {
      poloniex.returnTicker().then((data) => {
        ticker = data;
        resolve(data);
      }).catch(reject);
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
    poloniex.returnChartData(pair, ts).then((data) => {
      db[pair][ts] = data[0].weightedAverage;
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
