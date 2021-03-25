var app = require('./app');
var serverPortConfiguration = require("./config/serverPortConfig")
var port = process.env.PORT || serverPortConfiguration.port;

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});