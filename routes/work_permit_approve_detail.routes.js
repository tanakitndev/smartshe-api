const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../utils/database');

router.get('/', (req, res, next) => {
    db.query('SELECT * FROM work_permit_approve_detail', function (error, results, fields) {
        return res.send({
            error: false,
            data: results,
        });
    });
});

module.exports = router;
