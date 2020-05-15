const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');

// For เจ้าของพื้นที่ ปิดงาน
router.post('/assign-box-sensor', async (req, res, next) => {
    const work_permit_assign_id = req.body.work_permit_id;
    const node_id = req.body.node_id; // NodeID
    const sqlFindWorkPermitByNodeID = `SELECT id FROM work_permit WHERE box_sensor = ?`;
    const bindParamsFindWorkPermitByNodeID = [node_id]
    const [rowsWorkPermitByNodeId, fieldsWorkPermitByNodeId] = await db.query(sqlFindWorkPermitByNodeID, bindParamsFindWorkPermitByNodeID);

    if (rowsWorkPermitByNodeId.length) {
        const sqlUpdateWorkPermitToNull = `UPDATE work_permit SET ? WHERE id = ?`;
        const bindParamsUpdateWorkPermitToNull = [{ box_sensor: null }, rowsWorkPermitByNodeId[0].id]
        await db.query(sqlUpdateWorkPermitToNull, bindParamsUpdateWorkPermitToNull);
    }

    const sqlUpdateWorkPermitAssign = `UPDATE work_permit SET ? WHERE id = ?`;
    const bindParamsUpdateWorkPermitAssign = [{ box_sensor: node_id, timestamp: new Date() }, work_permit_assign_id, new Date()]
    await db.query(sqlUpdateWorkPermitAssign, bindParamsUpdateWorkPermitAssign);

    return res.send({
        error: false,
        rowsWorkPermitByNodeId
    });
});


module.exports = router;
