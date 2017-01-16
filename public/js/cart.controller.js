angular.module('petShopApp')
  .controller('cartController', function($http, $scope) {
    $http.post('/getCartItems', { ClientID: 1 })
      .then(function(response) {
        $scope.items = response.data;
        $scope.items.total = 0;
        $scope.items.forEach(function(item, index, items) {
          items.total = items.total + item.Pret * item.Cantitate;
        });
      });
    $scope.removeItem = function($index, item) {
      $http.post('/removeItemFromCart', item)
        .then(function success(response) {
          if (response.data === 'OK') {
            $scope.items.splice($index, 1);
          }
        })
    };
  });
