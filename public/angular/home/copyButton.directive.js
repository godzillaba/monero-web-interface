angular.module('angularModule')
.directive('copyButton', function() {
  return {
    restrict: 'E',
    template: function(elem, attr) {
      return "<md-button ngclipboard class='md-icon-button' data-clipboard-text='" + attr.text + "'> \
      <md-icon>content_copy</md-icon></md-button>"
    }
  }
});
