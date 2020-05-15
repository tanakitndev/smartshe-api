const express = require('express');
const router = express.Router();

// connection configurations
const db = require('../utils/database');

router.get('/:permit_type', (req, res, next) => {
    db.query(`SELECT 
    *, 
    wpm_question.id AS id, 
    wpm_type.name AS permit_type,
    work_permit_confine_types.name AS confine_types_name  
    FROM work_permit_questions wpm_question 
    LEFT JOIN work_permit_type wpm_type ON wpm_type.id = wpm_question.work_permit_type_id
    LEFT OUTER JOIN work_permit_confine_types ON work_permit_confine_types.id = wpm_question.work_permit_confine_type_id
    WHERE ?`, { 'wpm_type.name': req.params.permit_type }, function (error, results, fields) {
        return res.send({
            error: false,
            count: results.length,
            data: results,
        });
    });
});

module.exports = router;

// SELECT 
// work_permit_detail_item.id as id,
// work_permit_detail_item.work_permit_detail_id as work_permit_detail_id,
// work_permit_detail_item.approved_role as approved_role,
// work_permit_questions.title as title,
// work_permit_type.name as work_permit_type,
// work_permit_detail_item.value as value
// FROM `work_permit_detail_item`
// LEFT JOIN work_permit_type ON work_permit_type.id = work_permit_detail_item.work_permit_type_id
// LEFT JOIN work_permit_questions ON work_permit_questions.id = work_permit_detail_item.work_permit_question_id
// WHERE work_permit_detail_item.work_permit_detail_id = 31