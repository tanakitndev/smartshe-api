const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../utils/database');

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM db_logger ORDER BY id DESC', function (error, results, fields) {
        return res.send({
            error: false,
            data: results,
        });
    });
});

module.exports = router;
