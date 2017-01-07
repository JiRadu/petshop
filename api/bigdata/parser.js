var orase = require("./orase.js");
var exists;
var judete = [];
orase.forEach(function(oras) {
  exists = 0;
  judete.forEach(function(judet) {
    if (oras.JUDET == judet)
      exists = 1;
  });
  if (exists == 0) {
    judete.push(oras.JUDET);
  }
});
