var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
var corsFilter = require('./corsFilter');
var https = require('https');
//TODO move this to a method.
var hskey = fs.readFileSync('../SSLAcadia/server.key');
var hscert = fs.readFileSync('../SSLAcadia/server.crt');

var options = {
    key: hskey,
    cert: hscert
};

var TODOS_FILE = path.join(__dirname, 'todos.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/todos',cors(corsFilter.corsOptions), function(req, res) {
  console.log('received request get todos' + req);
  fs.readFile(TODOS_FILE, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    console.log('data'+data);
    res.json(JSON.parse(data));
  });
});

app.post('/api/todos',cors(corsFilter.corsOptions), function(req, res) {
  console.log('received request post todos' + req);
  fs.readFile(TODOS_FILE, function(err, data) {
    var todos = JSON.parse(data);
    todos.push(req.body);
    fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(todos);
    });
  });
});

/**
 * Create HTTP server.
 */

var server = https.createServer(options,app);

server.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
