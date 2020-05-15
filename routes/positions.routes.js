const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');

router.get('/', async (req, res, next) => {
    const sql = `SELECT * FROM positions`;
    const bindParams = null;
    const [rows, fields] = await db.query(sql, bindParams).catch(error => {
        return res.status(200).json({
            error: true,
            message: error.message,
            data: []
        });
    });
    return res.status(200).json({
        error: false,
        data: rows
    });
});

router.post('/', async (req, res, next) => {
    const sql = `INSERT INTO positions SET ?`;
    const bindParams = {
        name: req.body.name
    };

    const [rows, fields] = await db.query(sql, bindParams).catch(error => {
        return res.status(200).json({
            error: true,
            message: error.message,
            data: []
        });
    });
    
    return res.status(200).json({
        error: false,
        data: rows
    });
});

module.exports = router;