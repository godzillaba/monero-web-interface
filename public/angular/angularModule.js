angular.module('angularModule', ['ngMaterial', 'monospaced.qrcode', 'ngclipboard'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('grey');
    // .dark();
});
