'use strict';

var Gamepad = require('node-gamepad'),
    arDrone = require('ar-drone'),
    client  = arDrone.createClient()
;

// demo navdata
// client.config('general:navdata_demo', 'FALSE');
// client.on('navdata', console.log);

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

var takingOff = false,
    landing   = false
;

client.on('landing', function () {
    landing = true;
});


Gamepad.device(function (err, pad) {
    if (err) {
        console.error('Unable to get gamepad:', err);

        return;
    }

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


    // emergency STOP. Stops everything the drone is doing and makes it hover in place
    pad.on('crossPress', function () {
        client.stop();
    });

    // calibrates magnetometer (will yaw in place 360 degrees)
    pad.on('trianglePress', function () {
        client.calibrate(0);
    });

    // recover from emergency
    pad.on('squarePress', function () {
        client.disableEmergency();
    });

    pad.on('startPress', function () {
        // if already flying, ignore
        if (takingOff) {
            return;
        }

        takingOff = true;

        client.takeoff(function (err) {
            takingOff = false;
            err && console.error('Unable to takeoff:', err);
        });
    });

    pad.on('selectPress', function () {
        // if already landing, ignore
        if (landing) {
            return;
        }

        client.land(function (err) {
            landing = false;
            err && console.error('Unable to land:', err);
        });
    });
});


console.log('Usage hints:');
console.log('stop(), land()');

// create REPL just in case
client.createRepl();

// TODO: continuously print some main help commands for quick reference in REPL
