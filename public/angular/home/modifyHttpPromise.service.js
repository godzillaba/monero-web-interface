angular.module('angularModule')
.service('modifyHttpPromise', function() {
  return function(httpPromise) {
    return new Promise(function(resolve, reject) {
      httpPromise.then((res) => {
        if (res.data.error)
          reject(res.data);
        resolve(res.data);
      }).catch((res) => {
        reject(res.data);
      });
    });
  }
});
