var mysql = require('mysql');
var DB = require('./config/database');
var connection = mysql.createConnection(DB);
var express = require('express');
var app = express();

app.get('/clienti', function(req, res) {
  connection.query("SELECT * FROM `petshop`.`Client`", function(err, rows) {
    res.send(rows);
  });
});
app.get('/categorii', function(req, res) {
  connection.query("SELECT * FROM `petshop`.`Categorie`", function(err, rows) {
    res.send(rows);
  });
});
app.get('/produse', function(req, res) {
  connection.query("SELECT * FROM `petshop`.`Produs`", function(err, rows) {
    res.send(rows);
  });
});
app.post('/stergeProdus', function(req, res) {
  connection.query("DELETE FROM `petshop`.`Produs` WHERE ProdusID = '" + req.body.productID + "'", function(err, rows) {
    if (!err) {
      res.send('OK');
    }
  });
});
app.get('/produsePentruVizualizat', function(req, res) {
  connection.query("SELECT P.ProdusID, P.Nume, P.Descriere, P.Pret, P.DataAparitie,\
	 									P.Stoc, C.Nume as Categorie, A.Nume as Specie, A.Talie as Talie,\
										A.Varsta as Varsta, P.Firma, P.Aroma FROM Produs P, Animal A, Categorie C\
										WHERE P.CategorieID = C.CategorieID AND P.AnimalID = A.AnimalID",
    function(err, rows) {
      res.send(rows);
    });
});
app.get('/animalePentruVizualizat', function(req, res) {
  connection.query("SELECT A.AnimalID, A.Nume, A.Varsta, A.Talie, \
									 (SELECT count(AnimalID) FROM Produs P WHERE P.AnimalID = A.AnimalID) \
									 as NrProduse FROM Animal A GROUP BY AnimalID;",
    function(err, rows) {
      res.send(rows);
    });
});
app.get('/specii', function(req, res) {
  connection.query("SELECT Nume FROM `petshop`.`Animal` GROUP BY Nume", function(err, rows) {
    res.send(rows);
  });
});
app.get('/talii', function(req, res) {
  connection.query("SELECT Talie FROM `petshop`.`Animal` GROUP BY Talie", function(err, rows) {
    res.send(rows);
  });
});
app.get('/varste', function(req, res) {
  connection.query("SELECT Varsta FROM `petshop`.`Animal` GROUP BY Varsta", function(err, rows) {
    res.send(rows);
  });
});
app.post('/adaugaProdus', function(req, res) {
  var Produs = req.body;
  connection.query("SELECT CategorieID from `petshop`.`Categorie` WHERE Nume = '" + Produs.Categorie + "';", function(err, done) {
    if (!err) {
      var categorieID = done[0].CategorieID;
      connection.query("SELECT AnimalID from `petshop`.`Animal` WHERE Nume = '" + Produs.Specie + "'AND Talie='" + Produs.Talie + "' AND Varsta = '" + Produs.Varsta + "';", function(err, done) {
        if (!err) {
          var animalID = done[0].AnimalID;
          connection.query("INSERT INTO `petshop`.`Produs` (Nume, Descriere, Pret, DataAparitie, Stoc, CategorieID, AnimalID, Firma, Aroma ) \
					 VALUES ('" + Produs.Nume + "', '" + Produs.Descriere + "', '" + Produs.Pret + "',CURDATE(), '" + Produs.Stoc + "','" + categorieID + "','" + animalID + "','" + Produs.Firma + "','" + Produs.Aroma + "');", function(err, done) {
            if (!err) {
              res.send("OK");
            }
          });
        }
      });
    } else {
      console.log(err);
    }
  });
});
app.post('/editeazaProdus', function(req, res) {
  var Produs = req.body;
  connection.query("SELECT CategorieID from `petshop`.`Categorie` WHERE Nume = '" + Produs.Categorie + "';", function(err, done) {
    if (!err) {
      var categorieID = done[0].CategorieID;
      connection.query("SELECT AnimalID from `petshop`.`Animal` WHERE Nume = '" + Produs.Specie + "'AND Talie='" + Produs.Talie + "' AND Varsta = '" + Produs.Varsta + "';", function(err, done) {
        if (!err) {
          var animalID = done[0].AnimalID;
          connection.query("UPDATE `petshop`.`Produs` SET Nume = '" + Produs.Nume + "', \
													Descriere = '" + Produs.Descriere + "', Pret = '" + Produs.Pret + "',\
													Stoc = '" + Produs.Stoc + "', CategorieID =  '" + categorieID + "',\
													AnimalID = '" + animalID + "', Firma = '" + Produs.Firma + "', Aroma = '" + Produs.Aroma + "'\
													WHERE ProdusID = '" + Produs.ProdusID + "';", function(err, done) {
            if (!err) {
              res.send("OK");
            }
          });
        }
      });
    } else {
      console.log(err);
    }
  });



});


module.exports = app;
