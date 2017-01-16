angular
  .module('petShopApp', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngAnimate'])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      // For unmatched routes
      $urlRouterProvider.otherwise('/');

      // Application routes
      $stateProvider
        .state('index', {
          url: '/',
          templateUrl: 'templates/dashboard.html'
        })
        .state('shop', {
          url: '/shop',
          templateUrl: 'templates/shop.html'
        })
        .state('cart', {
          url: '/cart',
          controller: 'cartController',
          templateUrl: 'templates/cart.html'
        });
    }
  ]);
