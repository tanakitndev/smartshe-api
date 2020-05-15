const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../utils/database');

module.exports = function (io) {
    io.on('connection', function (socket) {
        console.log(`smartsensor_datanow connected ${new Date()}`);

        let prevDataUpdatedAt;
        let resultsSmartSensorDataNow;
        let interval = setInterval(function () {
            db.query('SELECT * FROM smartsensor_datanow ORDER BY datetime DESC LIMIT 0,1', function (error, results, fields) {
                if (results[0].datetime.toISOString() !== prevDataUpdatedAt) {
                    prevDataUpdatedAt = results[0].datetime.toISOString();
                    resultsSmartSensorDataNow = results;
                    db.query('SELECT * FROM smartsensor_datanow', function (error, results, fields) {
                        socket.volatile.emit('smartsensor_datanow', JSON.stringify(results));
                    });
                }
            });
        }, 1000);

        socket.on('disconnect', function () {
            clearInterval(interval);
            console.log('unsub smartsensor_datanow');
        });
    });

    router.get('/', (req, res, next) => {
        db.query('SELECT * FROM smartsensor_datanow', function (error, results, fields) {
            if (error) {
                return res.send({
                    error: true,
                    data: {},
                });
            }

            return res.send({
                error: false,
                count: results.length,
                data: results,
            });
        });
    });


    router.get('/test', (req, res, next) => {

        io.emit('update-work-area', 'Gotcha!');

        db.query('SELECT datetime FROM smartsensor_datanow ORDER BY datetime DESC LIMIT 0,1', function (error, results, fields) {

            return res.send({
                error: false,
                data: results
            });
        });

    });

    return router;
};
