angular.module('petShopApp')
  .controller('userModalCtrl', function($uibModalInstance, items, $http) {

    var self = this;

    self.ok = function() {
      $uibModalInstance.close('');
    };

    self.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    self.title = items ? "Editeaza datele unui client" : "Adauga un client nou";

  })
  .controller('productModalCtrl', function($uibModalInstance, items, $http, $location) {
    var self = this;
    self.tables = {};
    self.Produs = {};
    ///////////////////////////////
    ///// Daca e editare nu adaugare, se schimba titlul si se adauga campurile
    //////////////////////////////
    self.title = items ? "Editeaza un produs" : "Adauga un produs nou";
    if (items) {
      console.log(items.index);
      angular.copy(items.produs, self.Produs);
    }
    $http.get('/categorii')
      .then(function success(response) {
        self.tables.categorii = response.data;
      }, function error(response) {});
    $http.get('/specii')
      .then(function success(response) {
        self.tables.SpeciiAnimale = response.data;
      }, function error(response) {});

    $http.get('/talii')
      .then(function success(response) {
        self.tables.TalieAnimale = response.data;
      }, function error(response) {});
    $http.get('/varste')
      .then(function success(response) {
        self.tables.VarstaAnimale = response.data;
      }, function error(response) {});

    self.save = function() {
      if (items) {
        $http.post('/editeazaProdus', self.Produs)
          .then(function success(response) {
            $uibModalInstance.close({ produs: self.Produs, operation: 'edit', index: items.index });
          }, function error(err) {
            console.log(err);
          });
      } else {
        $http.post('/adaugaProdus', self.Produs)
          .then(function success(response) {
            $uibModalInstance.close({ produs: self.Produs, operation: 'add' });
          }, function error(err) {
            console.log(err);
          });
      }
    };

    self.cancel = function() {
      console.log("cancel");
      $uibModalInstance.dismiss('cancel');
    };
  });
