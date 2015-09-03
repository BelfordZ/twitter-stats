// this is the most trivial of web servers, and is not aimed at being production ready.
// I would assume you have your own node server setup, and this is more just for an example

var http = require('http');
var moment = require('moment');
var stats = require('./stats');

const PORT=8080;

var cacheTTL;
var cache = {};

function handleRequest(request, response) {
  if (!cacheTTL || cacheTTL < new Date()) {
    stats(function(err, result) {
      if (err) {
        return response.end(JSON.stringify(err));
      }
      cacheTTL = new Date(moment().add(5, 'minutes'));
      cache = result;
      response.end(JSON.stringify(result));
    });
  } else {
    response.end(JSON.stringify(cache));
  }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});
