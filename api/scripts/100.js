var connection = require('../config/database.js');
var orase = require('../bigdata/orase.js');
var rand_no = Math.random();

function insertClientsIntoDatabase(connection) {
  for (var i = 1; i < 100; i++) {
    var rand_no = Math.random();
    //Insereaza 100 de clienti Random
    connection.query("INSERT INTO petshop.Clienti(Nume, Utilizator, Parola, Email, Adresa, Oras, Judet) VALUES('Nume" + i + "','aleat" + i + "','parola','" + i + "@gmail.com','Strada x, Nr y','" + orase[(parseInt(rand_no * 13749) % orase.length)].NUME + "','" + orase[(parseInt(rand_no * 13749) % orase.length)].JUDET + "')");
    console.log("Success inserting 100 Clients");
  }
  return 0;
}
insertIntoDatabase(connection);
