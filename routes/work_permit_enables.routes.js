const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');
// const WorkPermit = require('../src/models/WorkPermit');
// const Department = require('../src/models/Department');
// const Location = require('../src/models/Location');

router.get('/', async (req, res, next) => {
    const [rows, fields] = await db.query(`SELECT * FROM work_permit_enables`);
    return res.send({
        error: false,
        data: rows,
    });
});

module.exports = router;