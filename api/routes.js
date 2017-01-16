var mysql = require('mysql');
var DB = require('./config/database');
var connection = mysql.createConnection(DB);
var express = require('express');
var app = express();
var orase = require('./bigdata/orase.js');
var judete = require('./bigdata/judete.js');
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
app.post('/stergeClient', function(req, res) {
  connection.query("DELETE FROM `petshop`.`Client` WHERE ClientID = '" + req.body.clientID + "'", function(err, rows) {
    if (!err) {
      res.send('OK');
    } else {
      res.send(err);
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
app.get('/arome', function(req, res) {
  connection.query("SELECT Aroma FROM `petshop`.`Produs` GROUP BY Aroma", function(err, rows) {
    res.send(rows);
  });
});
app.get('/firme', function(req, res) {
  connection.query("SELECT Firma FROM `petshop`.`Produs` GROUP BY Firma", function(err, rows) {
    res.send(rows);
  });
});
app.post('/orase', function(req, res) {
  var judet = req.body;
  res.send(orase);
});
app.post('/judete', function(req, res) {
  var oras = req.body;
  res.send(judete);
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
app.post('/adaugaClient', function(req, res) {
  var Client = req.body;
  connection.query("INSERT INTO `petshop`.`Client` (Nume, Utilizator, Parola, Email, Adresa, Oras, Judet) \
					 VALUES ('" + Client.Nume + "', '" + Client.Utilizator + "', '" + Client.Parola + "', '" + Client.Email + "','" + Client.Adresa + "','" + Client.Oras + "','" + Client.Judet + "');", function(err, done) {
    if (!err) {
      res.send("OK");
    } else {
      console.log(err);
    }
  });
});
app.post('/editeazaClient', function(req, res) {
  var Client = req.body;
  connection.query("UPDATE petshop.Client SET Nume = '" + Client.Nume + "', \
                  Utilizator = '" + Client.Utilizator + "', Parola = '" + Client.Parola + "',\
                  Email = '" + Client.Email + "', Adresa =  '" + Client.Adresa + "',\
                  Oras = '" + Client.Oras + "', Judet = '" + Client.Judet + "'\
                  WHERE ClientID = " + Client.ClientID + ";", function(err, done) {
    if (!err) {
      res.send("OK");
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
app.post('/addToCart', function(req, res) {
  var produs = req.body.produs;
  var cantitate = req.body.cantitate;
  var ComandaCurenta;
  connection.query("SELECT ComandaID FROM `petshop`.`Comanda` WHERE `ClientID` = 1", function(err, data) {
    if (!err) {
      if (data === [0]) {
        connection.query("INSERT INTO `petshop`.`Comanda`(`ClientID`,`Stare`,`DataAparitie`)\
        VALUES (1, 'Neconfirmata', NOW())", function(err, data) {
          if (!err) {
            ComandaCurenta = data;
            connection.query("INSERT INTO `petshop`.`ProdusComanda`(`ProdusId`,`ComandaID`,`Cantitate`)\
                VALUES ('" + produs.ProdusID + "','" + ComandaCurenta.ComandaID + "', '" + cantitate + "' );", function(err, done) {
              if (!err) {
                res.send("OK");
              }
            });
          }
        });
      } else {
        ComandaCurenta = data[0];
        connection.query("SELECT ProdusID FROM `petshop`.`ProdusComanda` WHERE ComandaID = " + ComandaCurenta.ComandaID, function(err, done) {
          if (!err) {
            var alreadyThere = false;
            done.forEach(function(item) {
              if (item.ProdusID == produs.ProdusID) {
                alreadyThere = true;
              }
            })
            if (alreadyThere) {
              connection.query("UPDATE `petshop`.`ProdusComanda` SET Cantitate = Cantitate + " + cantitate + " WHERE ProdusID = \
                  " + produs.ProdusID + " AND ComandaID = " + ComandaCurenta.ComandaID + "; ", function(err, done) {
                if (!err) {
                  res.send("OK");
                } else {}
              });
            } else {
              connection.query("INSERT INTO `petshop`.`ProdusComanda`(`ProdusID`,`ComandaID`,`Cantitate`)\
                  VALUES ('" + produs.ProdusID + "','" + ComandaCurenta.ComandaID + "', '" + cantitate + "' );", function(err, done) {
                if (!err) {
                  res.send("OK");
                } else {
                  res.send(err);
                }
              });
            }
          }
        });
      }
    }
  });
});

app.post('/getCartItems', function(req, res) {
  var ClientID = req.body.ClientID;
  var ComandaID;
  var CartItems;
  connection.query("SELECT * FROM Produs P, Comanda C, ProdusComanda PC WHERE P.ProdusID = PC.ProdusID AND C.ComandaID = PC.ComandaID AND C.Stare = 'Neconfirmata' AND C.ClientID = " + ClientID, function(err, done) {
    if (!err) {
      res.send(done);
    } else {
      res.send(err);
    }
  });
});
app.post('/removeItemFromCart', function(req, res) {
  var ProdusID = req.body.ProdusID;
  var ComandaID = req.body.ComandaID;
  connection.query("DELETE FROM `petshop`.`ProdusComanda` WHERE ComandaID = " + ComandaID + " AND ProdusID = " + ProdusID, function(err, done) {
    if (!err) {
      res.send("OK");
    } else {
      res.send(err);
    }
  });
});
module.exports = app;
