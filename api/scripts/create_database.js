var mysql = require('mysql');
var DB = require('../config/database');
var orase = require('../bigdata/orase.js');
var animale = require('../bigdata/animale.js');
var rand_no = Math.random();
var connection;
var Descrieri = require('../bigdata/descrieri.js');
module.exports = function createAll() {
  connection = mysql.createConnection(DB);
  createDB(connection);
  createAnimal(connection);
  insertAnimals(connection);
  createCategorie(connection);
  insertCategories(connection);
  createCategorieAnimal(connection);
  insertCategorieAnimale(connection);
  createProdus(connection);
  createClient(connection);
  insertClients(connection);
  createComanda(connection);
  createProdusComanda(connection);
  // connection.end();
};

function createDB(connection) {
  connection.query('CREATE DATABASE IF NOT EXISTS `petshop`');
  console.log('Success creating Database');
}

function createAnimal(connection) {
  connection.query('\
  CREATE TABLE IF NOT EXISTS `petshop`.`Animal`( \
      `AnimalID` INT NOT NULL AUTO_INCREMENT, \
      `Nume` VARCHAR(255) NOT NULL, \
      `Varsta` VARCHAR(255) NOT NULL, \
      `Talie` VARCHAR(255) NOT NULL, \
      PRIMARY KEY(`AnimalID`), \
      UNIQUE INDEX `AnimalID_UNIQUE` (`AnimalID` ASC), \
      UNIQUE KEY `Animal_Unique` (`Nume`,`Varsta`,`Talie` ASC)\
  )');
  console.log("Success creating Animal");
}

function insertAnimals(connection) {
  connection.query('SET FOREIGN_KEY_CHECKS = 0;');
  connection.query('TRUNCATE Animal;');
  connection.query('SET FOREIGN_KEY_CHECKS = 1;');
  animale.numeAnimale.forEach(function(animal) {
    animale.talieAnimale.forEach(function(talie) {
      animale.varsteAnimale.forEach(function(varsta) {
        connection.query('\
          INSERT IGNORE INTO petshop.Animal( Nume, Varsta, Talie )\
           VALUES ("' + animal + '", "' + varsta + '", "' + talie + '");');
      });
    });
  });
  console.log("Success inserting into Animals");
}

function createCategorie(connection) {
  connection.query('\
  CREATE TABLE IF NOT EXISTS `petshop`.`Categorie`( \
      `CategorieID` INT NOT NULL AUTO_INCREMENT, \
      `Nume` VARCHAR(255) NOT NULL, \
      `Descriere` VARCHAR(255) NOT NULL, \
      PRIMARY KEY(`CategorieID`), \
      UNIQUE INDEX `CategorieID_UNIQUE` (`CategorieID` ASC) \
  )');
  console.log("Success creating Categorie");
}

function insertCategories(connection) {
  connection.query('SET FOREIGN_KEY_CHECKS = 0;');
  connection.query('TRUNCATE Categorie;');
  connection.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log(Descrieri.hranaUmeda);
  connection.query('INSERT IGNORE INTO petshop.Categorie(Nume, Descriere) VALUES\
      ("Hrana Umeda", "' + Descrieri.hranaUmeda + '");');
  connection.query('INSERT IGNORE INTO petshop.Categorie(Nume, Descriere) VALUES\
      ("Hrana Uscata", "' + Descrieri.hranaUscata + '");');
  console.log("Success inserting into Categorie");
}

function createCategorieAnimal(connection) {
  connection.query('\
  CREATE TABLE IF NOT EXISTS `petshop`.`CategorieAnimal`( \
      `CategorieID` INT NOT NULL, \
      `AnimalID` INT NOT NULL, \
      PRIMARY KEY (`CategorieID`,`AnimalID`), \
      FOREIGN KEY(`CategorieID`) REFERENCES Categorie(`CategorieID`),  \
      FOREIGN KEY(`AnimalID`) REFERENCES Animal(`AnimalID`)  \
  )');
  console.log("Success creating CategorieAnimal");
}

function insertCategorieAnimale(connection) {
  connection.query('SELECT AnimalID from Animal', function(err, rows) {
    if (!err) {
      rows.forEach(function(Animal) {
        connection.query('SELECT CategorieID from Categorie', function(err, result) {
          if (!err) {
            result.forEach(function(Categorie) {
              connection.query('INSERT IGNORE INTO `petshop`.`CategorieAnimal`\
              (CategorieID, AnimalID) VALUES (' + Categorie.CategorieID + ', \
              ' + Animal.AnimalID + ')');
            });
          } else {
            console.log(err);
          }
        });
      });
    } else {
      console.log(err);
    }
  });
  console.log("Success inserting into Animals");
}

function createProdus(connection) {
  connection.query('\
  CREATE TABLE IF NOT EXISTS `petshop`.`Produs` ( \
      `ProdusID` INT NOT NULL AUTO_INCREMENT, \
      `Nume` VARCHAR(255) NOT NULL, \
      `Descriere` VARCHAR(255) NOT NULL, \
      `Pret` INT NOT NULL, \
      `DataAparitie` DATE NOT NULL, \
      `Stoc` INT, \
      `CategorieID` INT NOT NULL, \
      `AnimalID` INT NOT NULL, \
      `Firma` VARCHAR(255) NOT NULL, \
      `Aroma` VARCHAR(255) NOT NULL, \
      PRIMARY KEY (`ProdusID`), \
      FOREIGN KEY(`CategorieID`) REFERENCES CategorieAnimal(`CategorieID`), \
      FOREIGN KEY(`AnimalID`) REFERENCES CategorieAnimal(`AnimalID`), \
      UNIQUE INDEX `ProdusID_UNIQUE` (`ProdusID` ASC) \
  )');
  console.log("Success creating Produs");
}

function createClient(connection) {
  connection.query('\
  CREATE TABLE IF NOT EXISTS `petshop`.`Client` ( \
      `ClientID` INT NOT NULL AUTO_INCREMENT, \
      `Nume` VARCHAR(255) NOT NULL, \
      `Utilizator` VARCHAR(255) NOT NULL, \
      `Parola` VARCHAR(255) NOT NULL, \
      `Email` VARCHAR(255) NOT NULL, \
      `Adresa` VARCHAR(255) NOT NULL, \
      `Oras` VARCHAR(255) NOT NULL, \
      `Judet` VARCHAR(255) NOT NULL, \
          PRIMARY KEY (`ClientID`), \
      UNIQUE INDEX `ClientID_UNIQUE` (`ClientID` ASC), \
      UNIQUE INDEX `Email_UNIQUE` (`Email` ASC), \
      UNIQUE INDEX `Username_UNIQUE` (`Utilizator` ASC) \
  )');
  console.log('Success creating Client');
}

//Insereaza 100 de clienti Random
function insertClients(connection) {
  for (var i = 1; i < 100; i++) {
    var rand_no = Math.random();
    connection.query("INSERT IGNORE INTO `petshop`.`Client`(Nume, Utilizator, \
      Parola, Email, Adresa, Oras, Judet) VALUES('Nume" + i + "','aleat\
      " + i + "','parola','" + i + "@gmail.com','Strada x, Nr y','\
      " + orase[(parseInt(rand_no * 13749) % orase.length)].NUME + "','\
      " + orase[(parseInt(rand_no * 13749) % orase.length)].JUDET + "')");
  }
  console.log("Success inserting 100 Clients");
};

function createComanda(connection) {
  connection.query('\
  CREATE TABLE IF NOT EXISTS `petshop`.`Comanda` ( \
      `ComandaID` INT NOT NULL AUTO_INCREMENT, \
      `ClientID` INT NOT NULL, \
      `Stare` VARCHAR(255) NOT NULL, \
      `DataAparitie` DATE NOT NULL, \
      PRIMARY KEY (`ComandaID`), \
      FOREIGN KEY(`ClientID`) REFERENCES Client(`ClientID`), \
      UNIQUE INDEX `ComandaID_UNIQUE` (`ComandaID` ASC) \
  )');
  console.log('Success creating Comanda!');
}

function createProdusComanda(connection) {
  connection.query('\
  CREATE TABLE IF NOT EXISTS `petshop`.`ProdusComanda` ( \
      `ProdusID` INT NOT NULL , \
      `ComandaID` INT NOT NULL , \
      `Cantitate` INT NOT NULL, \
      PRIMARY KEY (`ProdusID`, `ComandaID`), \
      FOREIGN KEY(`ProdusID`) REFERENCES Produs(`ProdusID`), \
      FOREIGN KEY(`ComandaID`) REFERENCES Comanda(`ComandaID`) \
  )');
  console.log("Success creating ProdusComanda");
}
