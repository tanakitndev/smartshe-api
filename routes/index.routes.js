const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../utils/database');

module.exports = function (io) {
    //Socket.IO
    io.on('connection', function (socket) {
        console.log('Client has connected to Index');
        //ON Events
        // socket.on('route2', function () {
        //     console.log('Successful Socket Test');
        // });

        //End ON Events
        // socket.on('disconnect', function () {
        //     console.log('unsub tweet tttt');
        // });
    });

    router.get('/', (req, res, next) => {

        io.emit('index-route', 'Gotcha!');

        db.query('SELECT * FROM db_logger ORDER BY id DESC', function (error, results, fields) {
            let isConnected;
            if (error) {
                isConnected = false;
                return res.send({
                    error: true,
                    data: {},
                    isConnected,
                    message: 'database no connected.'
                });
            }

            isConnected = true;
            return res.send({
                error: false,
                data: results,
                isOnline: true,
                isConnected,
                message: 'database connected.'
            });
        });

    });

    return router;
};