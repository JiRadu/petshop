var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 3000;
var routes = require('./api/routes.js');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(routes);
app.listen(port);
console.log('May the node be with you on port ' + port);
