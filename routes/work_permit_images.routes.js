const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../src/database/database');


router.get('/:work_permit_id', async (req, res, next) => {
    const [rowsImage, fieldsImage] = await db.query(`
        SELECT 
        *,
        work_permit_images.id as id,
        work_permit_type.name as permit_type
        FROM work_permit_images
        LEFT OUTER JOIN work_permit_type ON work_permit_type.id = work_permit_images.work_permit_type_id
        WHERE work_permit_images.work_permit_id = ?
    `, [req.params.work_permit_id]);
    if (!rowsImage.length) {
        return res.send({
            error: true,
            data: [],
            message: 'Data not found!'
        });
    }
    return res.send({
        error: false,
        data: rowsImage,
    });
});

module.exports = router;
