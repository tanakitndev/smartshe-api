const express = require('express');
const router = express.Router();

// connection configurations
// const db = require('../utils/database');
const db = require('../src/database/database');

router.get('/', async (req, res, next) => {
    const [rows, fields] = await db.query('SELECT * FROM env_standard', null);
    return res.send({
        error: false,
        count: rows.length,
        data: rows,
    });
});

router.post('/', async (req, res, next) => {
    const sqlInsert = `
        INSERT INTO env_standard SET ?
    `;
    const values = {
        warning: req.body.warning,
        danger: req.body.danger,
        env_type: req.body.env_type
    };
    const [rows, fields] = await db.query(sqlInsert, values);

    return res.send({
        error: false,
        data: rows,
    });
});


router.put('/', (req, res, next) => {
    db.query('UPDATE env_standard SET ? WHERE ?', [body, { id: body.id }], function (error, results, fields) {
        if (error) {
            return res.send({
                success: false,
                data: [],
            });
        }

        return res.send({
            success: true,
            count: results.length,
            data: results,
        });
    });
});

router.put('/update/:id', async (req, res, next) => {
    const sql = `UPDATE env_standard SET ? WHERE ?`;
    const values = {
        warning: req.body.warning,
        danger: req.body.danger,
        env_type: req.body.env_type
    };
    const bindParams = [values, { id: req.params.id }];
    const [rows, fields] = await db.query(sql, bindParams).catch(err => next(err));

    return res.send({
        error: false,
        data: rows,
    });
});

router.post('/deletes', async (req, res, next) => {
    const sql = `DELETE FROM env_standard WHERE id IN (?)`;
    const bindParams = [req.body.ids, req.body.ids];
    const [rows, fields] = await db.query(sql, bindParams).catch(err => next(err));

    return res.send({
        error: false,
        data: rows,
    });
});


module.exports = router;
