// create server
var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
    fs.readFile('myhtml.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
}).listen(8080);
console.log("The server is currently running.");