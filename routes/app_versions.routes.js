const express = require('express');
const router = express.Router();

const db = require('../src/database/database');

router.get('/', (req, res) => {
    db.query('SELECT * FROM app_versions ORDER BY id DESC', null)
        .then((rows, fields) => {
            res.status(200).json({
                app_version: rows[0]
            });
        })
        .catch(err => {
            res.status(400).json({
                message: err
            });
        });
});

router.get('/latest/:platform', (req, res) => {
    db.query('SELECT * FROM app_versions WHERE platform=? ORDER BY id DESC LIMIT 0,1', [req.params.platform])
        .then((rows, fields) => {
            res.status(200).json({
                app_version: rows[0][0]
            });
        })
        .catch(err => {
            res.status(400).json({
                message: err
            });
        });
});
module.exports = router;