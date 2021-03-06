var express = require('express');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(express.static(__dirname+"/app"));

app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});