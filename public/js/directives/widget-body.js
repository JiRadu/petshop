angular
  .module('petShopApp')
  .directive('rdWidgetBody', rdWidgetBody);

function rdWidgetBody() {
  var directive = {
    requires: '^rdWidget',
    scope: {
      loading: '=?',
      classes: '@?',
    },
    transclude: true,
    template: '<div class="widget-body" ng-class="classes"><div class="widget-content" ng-transclude></div></div>',
    restrict: 'E'
  };
  return directive;
}
