'use strict';

var Gamepad = require('node-gamepad'),
    arDrone = require('ar-drone'),
    client  = arDrone.createClient()
;

// demo navdata
// client.config('general:navdata_demo', 'FALSE');
// client.on('navdata', console.log);

console.log('Usage hints:')
console.log('stop(), land(), ')

// create REPL just in case
client.createRepl();

// TODO: continuously print some main help commands for quick reference in REPL


// monkeypatch just to test values
// [
//     'left',
//     'right',
//     'front',
//     'back',
//     'counterClockwise',
//     'clockwise',
//     'up',
//     'down',
//     'animate',
//     'flipAhead',
//     'flipBehind',
//     'flipLeft',
//     'flipRight',
//     'stop',
//     'takeoff',
//     'land',
//     'calibrate'
// ].forEach(function (k) {
//     client[k] = console.log.bind(console, k);
// });

Gamepad.device(function (err, pad) {
    pad.on('leftStickChange', function (data) {
        // adjust values to drone values (0 - 1)
        var left  = Math.abs(Math.min(data.h, 127) - 127) / 127,
            right = Math.min(1, Math.abs(Math.max(data.h, 127) - 127) / 127),
            front = Math.abs(Math.min(data.v, 127) - 127) / 127,
            back  = Math.min(1, Math.abs(Math.max(data.v, 127) - 127) / 127)
        ;

        // apply values to drone
        client.left(left);
        client.right(right);
        client.front(front);
        client.back(back);
    });

    pad.on('rightStickChange', function (data) {
        // adjust values to drone values (0 - 1)
        var left  = Math.abs(Math.min(data.h, 127) - 127) / 127,
            right = Math.min(1, Math.abs(Math.max(data.h, 127) - 127) / 127),
            up    = Math.abs(Math.min(data.v, 127) - 127) / 127,
            down  = Math.min(1, Math.abs(Math.max(data.v, 127) - 127) / 127)
        ;

        // apply values to drone
        client.counterClockwise(left);
        client.clockwise(right);
        client.up(up);
        client.down(down);
    });

    pad.on('upPress', function () {
        client.animate('flipAhead', 1000);
    });

    pad.on('downPress', function () {
        client.animate('flipBehind', 1000);
    });

    pad.on('leftPress', function () {
        client.animate('flipLeft', 1000);
    });

    pad.on('rightPress', function () {
        client.animate('flipRight', 1000);
    });


    // emergency STOP. Stops everything the drone is doing and makes it hover inplace
    pad.on('crossPress', function () {
        client.stop();
    });

    // calibrates magnetometer (will yaw in place 360 degrees)
    pad.on('trianglePress', function () {
        client.calibrate(0);
    });

    pad.on('startPress', function () {
        client.takeoff(function (err) {
            err && console.error('Unable to takeoff:', err);
        });
    });

    pad.on('selectPress', function () {
        client.land(function (err) {
            err && console.error('Unable to land:', err);
        });
    });



});
