const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');

router.get('/work_area/fix/:nodename', async (req, res, next) => {
    const sql = `
   
    `;
    const bindParams = [];
    const [rows, fields] = await db.query(sql, bindParams);
    return res.send({
        error: false,
        data: rows,
    });
});

module.exports = router;

