const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');

// For เจ้าของพื้นที่ ปิดงาน
router.post('/close-job', async (req, res, next) => {
    const work_permit_id = req.body.work_permit_id;
    const user_id = req.body.user_id;
    const sqlUpdateStatusClose = `
        UPDATE work_permit SET ? WHERE id=?
    `;
    const bindParamsUpdateStatusClose = {
        statuspermit: 'closed',
        timestamp: new Date()
    };
    const [updatedWorkPermit, fieldsWorkPermit] = await db.query(sqlUpdateStatusClose, [bindParamsUpdateStatusClose, work_permit_id]);

    // After update insert tb work_permit_closed_detail 
    let insertedClosedDetail;
    if (updatedWorkPermit.changedRows) {
        const sqlInsertStatusCloseDetail = `
            INSERT INTO work_permit_closed_detail SET ?
        `;
        const valuesClosedDetail = {
            work_permit_id,
            user_id
        };
        insertedClosedDetail = await db.query(sqlInsertStatusCloseDetail, valuesClosedDetail)
    }


    return res.send({
        error: false,
        data: updatedWorkPermit,
        data2: insertedClosedDetail
    });
});

router.get('/closing/:user_owner_id', async (req, res, next) => {
    const sqlWorkPermitActive = `
                SELECT 
                *,
                work_permit.id as id,
                locations.name as location_name
                FROM work_permit
                LEFT OUTER JOIN locations ON locations.id =  work_permit.location_id
                WHERE work_permit.statuspermit=?
                AND locations.user_owner_id=?
                ORDER BY work_permit.id DESC`;
    const bindParams = ['active', req.params.user_owner_id];
    const [rows, fields] = await db.query(sqlWorkPermitActive, bindParams).catch(err => next(err));
    return res.send({
        error: false,
        count: rows.length,
        data: rows,
    });
});


module.exports = router;
