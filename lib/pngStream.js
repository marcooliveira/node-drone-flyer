module.exports = function (client, port) {
    port = port || 8000;

    require('ar-drone-png-stream')(client, { port: port });
};
