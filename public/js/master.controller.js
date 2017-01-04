angular.module('petShopApp')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$http','$uibModal','$rootScope', '$location', '$anchorScroll', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $http, $uibModal, $rootScope, $location, anchorScroll) {



    ///////////////////////////////////////////////////////
    // Initializare la butoane din Widgets
    ///////////////////////////////////////////////////////
    $scope.filtersAreCollapsed = 1;
    $scope.collapseFilters = function(){
        $scope.filtersAreCollapsed = 1;
      }
    $scope.expandFilters = function(){
        $scope.filtersAreCollapsed = 0;
    }
  ///////////////////////////////////////////////////////
  // Initializare la butoane din Widgets
  ///////////////////////////////////////////////////////
  $scope.productsExpand = 'fa-arrows-alt';
  $scope.ordersExpand = 'fa-arrows-alt';
  $scope.animalsExpand = 'fa-arrows-alt';
  $scope.clientsExpand = 'fa-arrows-alt';

  $scope.collapseProducts = function(){
    if($scope.productsAreCollapsed == 0){
      $scope.productsAreCollapsed = 1;
      $scope.productsExpand = 'fa-arrows-alt';
    } else {
      $scope.productsAreCollapsed = 0;
      $scope.productsExpand = 'fa-compress';
      $location.hash('tabelProduse');
      anchorScroll();
    }
  };
  $scope.collapseClients = function(){
    if($scope.clientsAreCollapsed == 0){
      $scope.clientsAreCollapsed = 1;
      $scope.clientsExpand = 'fa-arrows-alt';
    } else {
      $scope.clientsAreCollapsed = 0;
      $scope.clientsExpand = 'fa-compress';
      $location.hash('tabelClienti');
      anchorScroll();
    }
  };
  $scope.collapseOrders = function(){
    if($scope.ordersAreCollapsed == 0){
      $scope.ordersAreCollapsed = 1;
      $scope.ordersExpand = 'fa-arrows-alt';
    } else {
      $scope.ordersAreCollapsed = 0;
      $scope.ordersExpand = 'fa-compress';
      $location.hash('tabelComenzi');
      anchorScroll();
    }
  };
  $scope.collapseAnimals = function(){
    if($scope.animalsAreCollapsed == 0){
      $scope.animalsAreCollapsed = 1;
      $scope.animalsExpand = 'fa-arrows-alt';
    } else {
      $scope.animalsAreCollapsed = 0;
      $scope.animalsExpand = 'fa-compress';
      $location.hash('tabelAnimale');
      anchorScroll();
    }
  };

   ///////////////////////////////////////////////////////
   // Init la tabele
   ///////////////////////////////////////////////////////
     $scope.tables = {
       'clienti':[],
       'animale':[],
       'categorii':[],
       'produse':[],
       'animale':[],
       'cautare':[]
     };

     $http.get('/clienti')
     .then(function success(response){
       $scope.tables.clienti = response.data;
       // console.log(response.data);
     }, function error(response){
       // console.log(response);
     });
     $http.get('/categorii')
     .then(function success(response){
       $scope.tables.categorii = response.data;
       //  console.log(response.data);
     }, function error(response){
       //  console.log(response);
     });

     $http.get('/produsePentruVizualizat')
     .then(function success(response){
       $scope.tables.produse = response.data;
       // console.log($scope.tables.produse);
     }, function error(response){
     });

     $http.get('/animalePentruVizualizat')
     .then(function success(response){
       $scope.tables.animale = response.data;
       // console.log($scope.tables.produse);
     }, function error(response){
     });

   $scope.removeProduct = function($index,productID){
     $http.post('/stergeProdus',{'productID':productID})
     .then(function success(response){
       $scope.tables.produse.splice($index,1);
     }, function error(response){
     });
   }


      ///////////
      ////Ascundere Initiala tabele
      ///////////
      $scope.productsAreCollapsed = true;
      $scope.clientsAreCollapsed = true;
      $scope.ordersAreCollapsed = true;
      $scope.animalsAreCollapsed = true;

      ///////////////////////////////////////////////////////
      // Initializare paginare
      ///////////////////////////////////////////////////////
      $scope.currentPage = 1;
      $scope.itemsPerPage = 11;//the result is added by 1


    ///////////////////////////////////////////////////////
    // Initializare Modale
    ///////////////////////////////////////////////////////
    $scope.openUserModal = function (user) {
     var modalInstance = $uibModal.open({
       animation: true,
       ariaLabelledBy: 'modal-title',
       ariaDescribedBy: 'modal-body',
       templateUrl: '../templates/userModalTemplate.html',
       controller: 'userModalCtrl',
       controllerAs: '$ctrl',
       size: "lg",
       resolve: {
        items: function () {
          return user;
        }
      }
     });
    };

    $scope.openProductModal = function (product) {
      // console.log(product);
     var modalInstance = $uibModal.open({
       animation: true,
       ariaLabelledBy: 'modal-title',
       ariaDescribedBy: 'modal-body',
       templateUrl: '../templates/productModalTemplate.html',
       controller: 'productModalCtrl',
       controllerAs: '$ctrl',
       size: "lg",
       resolve: {
        items: function () {
          return product;
        }
      }
     });
       modalInstance.result.then(function (result) {
         console.log(result);
        if(result.operation == "add"){
          $scope.tables.produse.push(result.produs);
        } else { //if result.operation === edit
          $scope.tables.produse[result.index] = result.produs;
        }
      }, function () {
        console.log('Operation Canceled');
      });
    };
    ///////////////////////////////////////////////////////
    // Pentru Shop
    ///////////////////////////////////////////////////////

    $scope.speciiAlese = [];
    $scope.varsteAlese = [];
    $scope.taliiAlese = [];
    $scope.preturiAlese = [];
    $scope.firmeAlese = [];
    $scope.aromeAlese = [];

    $scope.cautare = function(){
      if($scope.speciiAlese.length || $scope.varsteAlese.length || $scope.taliiAlese.length || $scope.preturiAlese.length || $scope.firmeAlese.length || $scope.aromeAlese.length){
        $scope.tables.cautare = [];
      } else {
        $http.get('/produsePentruVizualizat')
        .then(function success(response){
          $scope.tables.cautare = response.data;
          $scope.nrBucati = [];
          for(i = 0; i < $scope.tables.cautare.length; i++){
            $scope.nrBucati[i] = 1;
          }
        }, function error(response){
        });
      }
    };
    $scope.cautare();

    $scope.choiceClose = function (index, array) {
      array.splice(index,1);
      $scope.cautare();
    }

    $scope.choiceAdd = function(choice, array) {
      var exists = false;
      array.forEach(function(alegere){
        if(alegere === choice) exists = true;
      });
      if(exists === false){
        array.push(choice);
        $scope.cautare();
      }
    }


    $scope.plusBucati = function($index){
      if($scope.nrBucati[$index] < 100){
        $scope.nrBucati[$index]++;
      }
    }
    $scope.minusBucati = function($index){
      if($scope.nrBucati[$index] > 1){
        $scope.nrBucati[$index]--;
      }
    }

    $scope.addToCart = function($index){

    }

    ///////////////////////////////////////////////////////
    // Chestii de responsiveness
    ///////////////////////////////////////////////////////
    var mobileView = 992;
    $scope.getWidth = function() {
        return window.innerWidth;
    };
    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });
    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };
    window.onresize = function() {
        $scope.$apply();
    };
    ///////////////////////////////////////////////////////
}
