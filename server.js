var http = require('http');
var app = require('./app');
const port = process.env.PORT || 5000;

http.createServer(app).listen(port);