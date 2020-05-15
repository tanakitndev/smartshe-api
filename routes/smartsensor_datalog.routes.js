const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../utils/database');

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM smartsensor_datalog', function (error, results, fields) {
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

module.exports = router;
