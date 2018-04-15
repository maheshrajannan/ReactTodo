var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var TODOS_FILE = path.join(__dirname, 'todos.json');

var https = require('https');
//TODO move this to a method.
var hskey = fs.readFileSync('../SSLAcadia/server.key');
var hscert = fs.readFileSync('../SSLAcadia/server.crt');

var options = {
    key: hskey,
    cert: hscert
};

app.set('port', (process.env.PORT || 4000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Create HTTP server.
 */

var server = https.createServer(options,app);


server.listen(app.get('port'), function() {
  console.log('Server started: https://localhost:' + app.get('port') + '/');
});
