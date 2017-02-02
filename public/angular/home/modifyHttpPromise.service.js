angular.module('angularModule')
.service('modifyHttpPromise', ['$q', function($q) {
  return function(httpPromise) {
    return $q(function(resolve, reject) {
      httpPromise.then((res) => {
        if (res.data.error)
          reject(res.data);
        resolve(res.data);
      }).catch((res) => {
        reject(res.data);
      });
    });
  }
}]);
