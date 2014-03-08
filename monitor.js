var arDrone = require('ar-drone'),
    drone   = arDrone.createClient()
;

drone.on('navdata', console.log);
