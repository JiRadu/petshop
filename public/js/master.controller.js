angular.module('petShopApp')
  .controller('MasterCtrl', ['$scope', '$cookieStore', '$http', '$uibModal',
    '$rootScope', '$location', '$anchorScroll', '$window', MasterCtrl
  ]);

function MasterCtrl($scope, $cookieStore, $http, $uibModal, $rootScope, $location, anchorScroll, $window) {
  ///////////////////////////////////////////////////////
  // Initializare la butoane din Widgets
  ///////////////////////////////////////////////////////
  $scope.filtersAreCollapsed = 1;
  $scope.collapseFilters = function() {
    $scope.filtersAreCollapsed = 1;
  };
  $scope.expandFilters = function() {
    $scope.filtersAreCollapsed = 0;
  };
  ///////////////////////////////////////////////////////
  // Initializare la butoane din Widgets
  ///////////////////////////////////////////////////////
  $scope.productsExpand = 'fa-arrows-alt';
  $scope.ordersExpand = 'fa-arrows-alt';
  $scope.animalsExpand = 'fa-arrows-alt';
  $scope.clientsExpand = 'fa-arrows-alt';

  $scope.collapseProducts = function() {
    if ($scope.productsAreCollapsed === 0) {
      $scope.productsAreCollapsed = 1;
      $scope.productsExpand = 'fa-arrows-alt';
    } else {
      $scope.productsAreCollapsed = 0;
      $scope.productsExpand = 'fa-compress';
      $location.hash('tabelProduse');
      anchorScroll();
    }
  };
  $scope.collapseClients = function() {
    if ($scope.clientsAreCollapsed === 0) {
      $scope.clientsAreCollapsed = 1;
      $scope.clientsExpand = 'fa-arrows-alt';
    } else {
      $scope.clientsAreCollapsed = 0;
      $scope.clientsExpand = 'fa-compress';
      $location.hash('tabelClienti');
      anchorScroll();
    }
  };
  $scope.collapseOrders = function() {
    if ($scope.ordersAreCollapsed === 0) {
      $scope.ordersAreCollapsed = 1;
      $scope.ordersExpand = 'fa-arrows-alt';
    } else {
      $scope.ordersAreCollapsed = 0;
      $scope.ordersExpand = 'fa-compress';
      $location.hash('tabelComenzi');
      anchorScroll();
    }
  };
  $scope.collapseAnimals = function() {
    if ($scope.animalsAreCollapsed === 0) {
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
    'clienti': [],
    'animale': [],
    'categorii': [],
    'produse': [],
    'cautare': []
  };

  $http.get('/clienti')
    .then(function success(response) {
      $scope.tables.clienti = response.data;
      // console.log(response.data);
    }, function error(response) {
      // console.log(response);
    });
  $http.get('/categorii')
    .then(function success(response) {
      $scope.tables.categorii = response.data;
      //  console.log(response.data);
    }, function error(response) {
      //  console.log(response);
    });

  $http.get('/produsePentruVizualizat')
    .then(function success(response) {
      $scope.tables.produse = response.data;
      // console.log($scope.tables.produse);
    }, function error(response) {});

  $http.get('/animalePentruVizualizat')
    .then(function success(response) {
      $scope.tables.animale = response.data;
      // console.log($scope.tables.produse);
    }, function error(response) {});

  $scope.removeProduct = function(index, productID) {
    $http.post('/stergeProdus', { productID: productID })
      .then(function success(response) {
        $scope.tables.produse.splice(index, 1);
      }, function error(response) {});
  };
  $scope.removeClient = function(index, clientID) {
    $http.post('/stergeClient', { clientID: clientID })
      .then(function success(response) {
        $scope.tables.clienti.splice(index, 1);
      }, function error(response) {
        console.log(response);
      });
  };


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
  $scope.itemsPerPage = 11; //the result is added by 1


  ///////////////////////////////////////////////////////
  // Initializare Modale
  ///////////////////////////////////////////////////////
  $scope.openUserModal = function(Client) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '../templates/userModalTemplate.html',
      controller: 'userModalCtrl',
      controllerAs: '$ctrl',
      size: "lg",
      resolve: {
        items: function() {
          return Client;
        }
      }
    });
    modalInstance.result.then(function(result) {
      if (result.operation == "add") {
        $scope.tables.clienti.push(result.client);
      } else { //if result.operation === edit
        $scope.tables.clienti[result.index] = result.client;
      }
    }, function() {
      console.log('Operation Canceled');
    });
  };

  $scope.openProductModal = function(product) {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: '../templates/productModalTemplate.html',
      controller: 'productModalCtrl',
      controllerAs: '$ctrl',
      size: "lg",
      resolve: {
        items: function() {
          return product;
        }
      }
    });
    modalInstance.result.then(function(result) {
      if (result.operation == "add") {
        $scope.tables.produse.push(result.produs);
        $scope.cautare();
      } else { //if result.operation === edit
        $scope.tables.produse[result.index] = result.produs;
        $scope.cautare();
      }
    }, function() {
      console.log('Operation Canceled');
    });
  };
  ///////////////////////////////////////////////////////
  // Pentru Shop
  ///////////////////////////////////////////////////////

  $scope.filtre = {
    specii: [],
    arome: [],
    firme: [],
    talii: [],
    varste: []
  };

  $scope.speciiAlese = [];
  $scope.taliiAlese = [];
  $scope.firmeAlese = [];
  $scope.aromeAlese = [];
  $scope.varsteAlese = [];
  var validProduct = false;
  var index;
  $scope.cautare = function() {
    $http.get('/produsePentruVizualizat')
      .then(function success(response) {
        $scope.tables.cautare = response.data;
        $http.get('/produsePentruVizualizat')
          .then(function success(response) {
            var cautare = response.data;
            $scope.nrBucati = [];
            if ($scope.speciiAlese.length) {
              cautare.forEach(function(produs) {
                $scope.speciiAlese.forEach(function(specieAleasa) {
                  if (produs.Specie === specieAleasa) {
                    validProduct = true;
                  }
                });
                if (validProduct === false) {
                  removeElement(produs);
                }
                validProduct = false;
              });
            }
            if ($scope.varsteAlese.length) {
              cautare.forEach(function(produs) {
                $scope.varsteAlese.forEach(function(varstaAleasa) {
                  if (produs.Varsta === varstaAleasa) {
                    validProduct = true;
                  }
                });
                if (validProduct === false) {
                  removeElement(produs);
                }
                validProduct = false;
              });
            }
            if ($scope.taliiAlese.length) {
              cautare.forEach(function(produs) {
                $scope.taliiAlese.forEach(function(talieAleasa) {
                  if (produs.Talie === talieAleasa) {
                    validProduct = true;
                  }
                });
                if (validProduct === false) {
                  removeElement(produs);
                }
                validProduct = false;
              });
            }
            if ($scope.firmeAlese.length) {
              cautare.forEach(function(produs) {
                $scope.firmeAlese.forEach(function(firmaAleasa) {
                  if (produs.Firma === firmaAleasa) {
                    validProduct = true;
                  }
                });
                if (validProduct === false) {
                  removeElement(produs);
                }
                validProduct = false;
              });
            }
            if ($scope.aromeAlese.length) {
              cautare.forEach(function(produs) {
                $scope.aromeAlese.forEach(function(aromaAleasa) {
                  if (produs.Aroma === aromaAleasa) {
                    validProduct = true;
                  }
                });
                if (validProduct === false) {
                  removeElement(produs);
                }
                validProduct = false;
              });
            }
            for (i = 0; i < $scope.tables.cautare.length; i++) {
              $scope.nrBucati[i] = 1;
            }
            ///REINITIALIZARE OPTIUNI
            $http.get('/arome')
              .then(function success(response) {
                var arome = response.data;
                $http.get('/firme')
                  .then(function success(response) {
                    var firme = response.data;
                    $http.get('/talii')
                      .then(function success(response) {
                        var talii = response.data;
                        $http.get('/varste')
                          .then(function success(response) {
                            var varste = response.data;
                            $http.get('/specii')
                              .then(function success(response) {
                                var specii = response.data;
                                afisareFiltru(specii, 'Nume', 'Specie', $scope.filtre.specii);
                                afisareFiltru(varste, 'Varsta', 'Varsta', $scope.filtre.varste);
                                afisareFiltru(talii, 'Talie', 'Talie', $scope.filtre.talii);
                                afisareFiltru(firme, 'Firma', 'Firma', $scope.filtre.firme);
                                afisareFiltru(arome, 'Aroma', 'Aroma', $scope.filtre.arome);
                              }, function error(response) {});
                          }, function error(response) {});
                      }, function error(response) {});
                  }, function error(response) {});
              }, function error(response) {});
          }, function error(response) {});
      }, function error(response) {});
  };

  function removeElement(produs) {
    $scope.tables.cautare.forEach(function(produsInitial) {
      if (produsInitial.ProdusID === produs.ProdusID) {
        index = $scope.tables.cautare.indexOf(produsInitial);
      }
    });
    $scope.tables.cautare.splice(index, 1);
  }
  var optiuneValida = true;
  //TODO: denumiri de variabile mai explicite
  function afisareFiltru(optiune, campDeCautat, campCautat, arrayFinal) {
    $scope.tables.cautare.forEach(function(produs) {
      optiune.forEach(function(element) {
        if (element[campDeCautat] === produs[campCautat]) {
          arrayFinal.forEach(function(optiune) {
            if (optiune[campDeCautat] === element[campDeCautat]) {
              optiuneValida = false;
            }
          });
          if (optiuneValida === true) {
            arrayFinal.push(element);
          }
          optiuneValida = true;
        }
      });
    });
  }

  $scope.cautare();

  $scope.choiceClose = function(index, array) {
    array.splice(index, 1);
    $scope.cautare();
  };

  $scope.choiceAdd = function(choice, array) {
    var exists = false;
    array.forEach(function(alegere) {
      if (alegere === choice) exists = true;
    });
    if (exists === false) {
      array.push(choice);
      $scope.cautare();
    }
  };


  $scope.plusBucati = function($index) {
    if ($scope.nrBucati[$index] < 100) {
      $scope.nrBucati[$index]++;
    }
  };
  $scope.minusBucati = function($index) {
    if ($scope.nrBucati[$index] > 1) {
      $scope.nrBucati[$index]--;
    }
  };

  $scope.addToCart = function(index, produs) {
    $http.post('/addToCart', { produs: produs, cantitate: $scope.nrBucati[index] }).then(function success(response) {
      if (response.data == 'OK') {
        $window.alert("Produs adaugat cu success");
      } else {
        console.log(response);
      }
    }, function error(err) {
      console.log(err);
    });
  };

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
        $scope.toggle = !$cookieStore.get('toggle') ? false : true;
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
