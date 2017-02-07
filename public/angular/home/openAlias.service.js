angular.module('angularModule')
.service('openAlias', ['$http', 'modifyHttpPromise', function($http, modifyHttpPromise) {
  return function(alias) {
    return modifyHttpPromise($http.post('/jsonRPC', {
      jsonrpc: '2.0',
      id: 1,
      method: 'openAlias',
      params: {
        name: alias
      }
    }));
  }
}]);
