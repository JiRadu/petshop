angular.module('petShopApp')
  .controller('cartController', function($http, $scope, $state) {
    $http.post('/getCartItems', { ClientID: 1 })
      .then(function(response) {
        if (response.data.length > 0) {
          $scope.items = response.data;
          $scope.items.total = 0;
          $scope.items.forEach(function(item, index, items) {
            items.total = items.total + item.Pret * item.Cantitate;
          });
          $scope.items.ComandaID = $scope.items[0].ComandaID;
        } else {
          $scope.items = [];
        }
      });
    $scope.removeItem = function($index, item) {
      $http.post('/removeItemFromCart', item).then(function success(response) {
        if (response.data === 'OK') {
          $scope.items.splice($index, 1);
          $scope.items.total = 0;
          $scope.items.forEach(function(item, index, items) {
            items.total = items.total + item.Pret * item.Cantitate;
          });
        }
      });
    };

    $scope.cancelOrder = function(ComandaID) {
      $http.post('/cancelOrder', { ComandaID: ComandaID }).then(function success(response) {
        if (response.data === "OK") {
          $scope.items = [];
        }
      });
    };

    $scope.confirmOrder = function(ComandaID) {
      $http.post('/confirmOrder', { ComandaID: ComandaID }).then(function success(response) {
        $scope.items = [];
      });
    };
  });
