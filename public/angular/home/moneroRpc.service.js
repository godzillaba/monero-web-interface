angular.module('angularModule')
.service('moneroRpc', ['$http', 'modifyHttpPromise', function($http, modifyHttpPromise) {
  function rpcPost(endpoint, method, params) {
    data = {
      jsonrpc: "2.0",
      id: "0",
      method: method,
      params: params
    }

    return modifyHttpPromise($http({
      method: 'POST',
      url: '/jsonRPC/' + endpoint,
      headers: {
        'Content-type': 'application/json'
      },
      data: data
    }));
  }

  return rpcPost;
}]);
