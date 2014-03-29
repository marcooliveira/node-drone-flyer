var http  = require("http"),
    drone = require("dronestream")
;

module.exports = function (port, interface) {
    port = port || 8000;
    interface = interface || '0.0.0.0';

    var server = http.createServer(function(req, res) {
      require("fs").createReadStream(__dirname + "/index.html").pipe(res);
    });

    drone.listen(server);
    server.listen(port);
}
