const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');

module.exports = function (io) {
    io.on('connection', function (socket) {
        console.log(`Job-list connected ${new Date()}`);

        let prevDataUpdatedAt;
        let timestampNow;
        let interval = setInterval(async () => {
            const sqlLatestTime = `SELECT timestamp FROM work_permit ORDER BY timestamp DESC LIMIT 0,1`;
            const [rows, fields] = await db.query(sqlLatestTime);
            if (rows[0].timestamp.toISOString() !== prevDataUpdatedAt) {
                prevDataUpdatedAt = rows[0].timestamp.toISOString();
                timestampNow = rows[0].timestamp;
                // console.log('timestamp', timestampNow);
                const sql = `
                            SELECT 
                        work_permit.id as id,
                        work_permit.created_at as created_at,
                        work_permit.permit_enable as permit_enable,
                        locations.lat as lat,
                        locations.lng as lng,
                        locations.name as location_name,
                        user.username as username
                        FROM work_permit
                        LEFT OUTER JOIN locations ON locations.id = work_permit.location_id
                        LEFT OUTER JOIN user ON work_permit.user_id = user.id
                        WHERE work_permit.statuspermit='active'
                        `;
                const [rowsWorkPermit, fieldsWorkPermit] = await db.query(sql, null);
                socket.volatile.emit('job-list', rowsWorkPermit);
            }
        }, 1000);

        socket.on('disconnect', function () {
            clearInterval(interval);
            console.log('unsub job-list');
        });

    });

    router.get("/", async (req, res, next) => {
        const sql = `
            SELECT 
            work_permit.id as id,
            work_permit.created_at as created_at,
            work_permit.permit_enable as permit_enable,
            locations.lat as lat,
            locations.lng as lng,
            locations.name as location_name,
            user.username as username
            FROM work_permit
            LEFT OUTER JOIN locations ON locations.id = work_permit.location_id
            LEFT OUTER JOIN user ON work_permit.user_id = user.id
            WHERE work_permit.statuspermit='active'
        `;
        const [rows, fields] = await db.query(sql, null);
        return res.send({
            error: false,
            count: rows.length,
            data: rows,
        });
    });

    return router;
}