angular.module('petShopApp')
    .controller('addUserModalCtrl', function ($uibModalInstance, items, $http) {

  var self = this;

  self.ok = function () {
    console.log("ok");
    $uibModalInstance.close('');
  };

  self.cancel = function () {
    console.log("cancel");
    $uibModalInstance.dismiss('cancel');
  };

  self.title = items?"Editeaza datele unui client":"Adauga un client nou";

})
    .controller('addProductModalCtrl', function ($uibModalInstance, items, $http, $location) {
  var self = this;
  self.Product = {};
  self.tables = {
    'categorii':{}
  }
  $http.get('/categorii')
     .then(function success(response){
       self.tables.categorii = response.data;
      //  console.log(response.data);
     }, function error(response){
      //  console.log(response);
     });
   $http.get('/specii')
      .then(function success(response){
        self.tables.SpeciiAnimale = response.data;
        // console.log(response.data);
      }, function error(response){
       //  console.log(response);
      });

  $http.get('/talii')
     .then(function success(response){
       self.tables.TalieAnimale = response.data;
      //  console.log(response.data);
     }, function error(response){
      //  console.log(response);
     });
   $http.get('/varste')
      .then(function success(response){
        self.tables.VarstaAnimale = response.data;
       //  console.log(response.data);
      }, function error(response){
       //  console.log(response);
      });

  self.save = function () {
    if(items){
      $http.post('/editeazaProdus', self.Produs)
         .then(function success(response){
           location.reload();
         }, function error(err){
           console.log(err);
         });
      $uibModalInstance.close('');
    } else {
      $http.post('/adaugaProdus',self.Produs)
         .then(function success(response){
           location.reload();
         }, function error(err){
           console.log(err);
         });
      $uibModalInstance.close('');
    }
  };

  self.cancel = function () {
    console.log("cancel");
    $uibModalInstance.dismiss('cancel');
  };
///////////////////////////////
///// Daca e editare nu adaugare, se schiba titlul si se adauga campurile
//////////////////////////////
  self.title = items?"Editeaza un produs":"Adauga un produs nou";
  if(items)
  {
    self.Produs = items;
  }
});
