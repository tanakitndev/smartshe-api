const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');

// For เจ้าของ work_permit
router.get('/', async (req, res, next) => {
    const sql = `SELECT * FROM department WHERE department IS NOT NULL`;
    const bindParams = null;
    const [rows, fields] = await db.query(sql, bindParams).catch(err => next(err));

    return res.send({
        error: false,
        data: rows,
    });
});

router.post('/', async (req, res, next) => {
    const sql = `INSERT INTO department SET ?`;
    const values = {
        department: req.body.department,
        building_code: req.body.building_code
    };
    const [rows, fields] = await db.query(sql, values)
        .catch(err => {
            return res.json({
                err: true,
                message: err.message
            })
        });

    return res.send({
        error: false,
        data: rows,
    });
});

router.put('/update/:id', async (req, res, next) => {
    const sql = `UPDATE department SET ? WHERE ?`;
    const values = {
        ...req.body.department,
    };
    const bindParams = [values, { id: req.params.id }];
    const [rows, fields] = await db.query(sql, bindParams).catch(err => next(err));

    return res.send({
        error: false,
        data: rows,
    });
});

router.post('/deletes', async (req, res, next) => {
    const sql = `DELETE FROM department WHERE id IN (?)`;
    const bindParams = [req.body.ids];
    const [rows, fields] = await db.query(sql, bindParams)
        .catch(err => {
            res.send({
                error: true,
                message: err.message
            });
        });

    return res.send({
        error: false,
        data: rows,
    });
});

module.exports = router;
