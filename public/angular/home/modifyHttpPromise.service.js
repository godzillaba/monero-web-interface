angular.module('angularModule')
.service('modifyHttpPromise', function() {
  return function(httpPromise) {
    return new Promise(function(resolve, reject) {
      httpPromise.then((res) => {
        if (res.data.error)
          reject(res);
        resolve(res);
      }).catch(reject);
    });
  }
});
