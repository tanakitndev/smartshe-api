const express = require("express");
const router = express.Router();

// connection configurations
const db = require("../src/database/database");

const WorkPermitDetail = require("../src/models/WorkPermitDetail");
const WorkPermitDetailConfine = require("../src/models/WorkPermitDetailConfine");

router.get("/:work_permit_id", async (req, res, next) => {
  const [rowsQuestion, fieldsQuestion] = await db.query(
    `
    SELECT 
    *,
    work_permit_type.name as work_permit_type 
    FROM work_permit_detail_item
    LEFT OUTER JOIN work_permit_detail ON work_permit_detail.id = work_permit_detail_item.work_permit_detail_id
    LEFT OUTER JOIN work_permit_type ON work_permit_type.id = work_permit_detail_item.work_permit_type_id
    LEFT OUTER JOIN work_permit_questions ON work_permit_questions.id = work_permit_detail_item.work_permit_question_id
    WHERE work_permit_detail.work_permit_id = ?
    `,
    [req.params.work_permit_id]
  );
  if (!rowsQuestion.length) {
    return res.send({
      error: true,
      data: [],
      message: "Data not found!"
    });
  }
  return res.send({
    error: false,
    data: rowsQuestion
  });
});

router.get("/confine/:task_id", async (req, res, next) => {
  // wpm_id to find wpm_detail_id
  const work_permit_id = req.params.task_id;

  const workPermitDetail = await WorkPermitDetail.findAll({
    where: {
      work_permit_id: work_permit_id
    },
    include: [
      {
        model: WorkPermitDetailConfine,
        as: "work_permit_confines"
      }
    ]
  }).catch(err => {
    res.send({
      error: true,
      data: [],
      message: err.message
    });
  });

  res.send({
    error: false,
    data: workPermitDetail[0] // exact array
    // workPermitDetail
  });
});
module.exports = router;
