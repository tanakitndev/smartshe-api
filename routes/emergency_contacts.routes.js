const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');

router.get('/', async (req, res, next) => {
    const sql = `
    SELECT 
    emc.id,
    emc.name,
    emc.telephone,
    emc.position_id,
    p.name as position_name
    FROM emergency_contacts emc
    LEFT OUTER JOIN positions p ON p.id = emc.position_id
    WHERE del_flg='0'
    ORDER BY emc.id DESC`;
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
    const sql = `INSERT INTO emergency_contacts SET ?`;
    const bindParams = {
        name: req.body.name,
        telephone: req.body.telephone,
        position_id: req.body.position_id
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

router.put('/update/:id', async (req, res, next) => {
    const sql = `UPDATE emergency_contacts SET ? WHERE ?`;
    const values = {
        name: req.body.emergency_contacts.name,
        telephone: req.body.emergency_contacts.telephone
    };
    const bindParams = [values, { id: req.params.id }];
    const [rows, fields] = await db.query(sql, bindParams).catch(err => next(err));

    return res.send({
        error: false,
        data: rows,
    });
});


router.post('/deletes', async (req, res, next) => {
    const sql = `UPDATE emergency_contacts SET del_flg='1', updated_at=? WHERE id IN (?)`;
    const bindParams = [new Date(), req.body.ids];
    const [rows, fields] = await db.query(sql, bindParams).catch(err => next(err));

    return res.send({
        error: false,
        data: rows,
    });
});


module.exports = router;