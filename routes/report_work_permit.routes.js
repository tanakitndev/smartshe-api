const express = require("express");
const router = express.Router();
const pdf = require("html-pdf");
const path = require('../utils/path');

const pdfHotTemplate = require("../documents/report_hot_work_permit");
const pdfHighTemplate = require("../documents/report_high_work_permit");
const pdfConfineTemplate = require("../documents/report_confine_work_permit");

// connection configurations
const db = require("../src/database/database");
const WorkPermitAdminNotice = require("../src/models/WorkPermitAdminNotice");
const WorkPermitAdminProtection = require("../src/models/WorkPermitAdminProtection");
const WorkPermitAdminVerify = require("../src/models/WorkPermitAdminVerify");

// POST pdf generate
router.post("/create-hot-pdf", (req, res) => {
  pdf.create(pdfHotTemplate(req.body), {}).toFile("result-hot.pdf", (err) => {
    if (err) {
      res.send(Promise.resolve());
    }

    res.send(Promise.resolve());
  });
});
// GET send generated pdf to client
router.get("/fetch-hot-pdf", (req, res) => {
  // res.send({
  //   data: `${path}/result.pdf`
  // })
  res.sendFile(`${path}/result-hot.pdf`);
});

// POST pdf generate
router.post("/create-high-pdf", (req, res) => {
  pdf.create(pdfHighTemplate(req.body), {}).toFile("result-high.pdf", (err) => {
    if (err) {
      res.send(Promise.resolve());
    }

    res.send(Promise.resolve());
  });
});
// GET send generated pdf to client
router.get("/fetch-high-pdf", (req, res) => {
  // res.send({
  //   data: `${path}/result.pdf`
  // })
  res.sendFile(`${path}/result-high.pdf`);
});

// POST pdf generate
router.post("/create-confine-pdf", (req, res) => {
  pdf.create(pdfConfineTemplate(req.body), {}).toFile("result-confine.pdf", (err) => {
    if (err) {
      res.send(Promise.resolve());
    }

    res.send(Promise.resolve());
  });
});
// GET send generated pdf to client
router.get("/fetch-confine-pdf", (req, res) => {
  // res.send({
  //   data: `${path}/result.pdf`
  // })
  res.sendFile(`${path}/result-confine.pdf`);
});

router.get("/", async (req, res) => {
  const sql = `
          SELECT
          *,
          work_permit.id as id,
          work_permit.created_at as work_at,
          locations.name as location_name
          FROM work_permit
          LEFT JOIN user ON user.id = work_permit.user_id
          LEFT JOIN locations ON locations.id = work_permit.location_id
    `;
  const bindParams = null;
  const [rows, fields] = await db.query(sql, bindParams);

  res.status(200).json({
    error: false,
    data: rows,
  });
});

router.get("/:id", async (req, res) => {
  const sql = `
            SELECT
            *,
            work_permit_detail.id as work_permit_detail_id,
            work_permit.id as id,
            work_permit.created_at as work_at,
            locations.name as location_name,
            department.department as department_name
            FROM work_permit_detail
            INNER JOIN work_permit ON work_permit.id = work_permit_detail.work_permit_id
            LEFT JOIN user ON user.id = work_permit.user_id
            LEFT JOIN locations ON locations.id = work_permit.location_id
            LEFT JOIN department ON department.id = work_permit.department_id
            WHERE work_permit.id = ?
      `;
  const bindParams = [req.params.id];
  const [rows, fields] = await db.query(sql, bindParams);

  let work_permit_detail_id = rows[0].work_permit_detail_id;
  let work_permit_id = rows[0].work_permit_id;
  const [rowsHelpers, fieldsHelpers] = await db.query(
    `
      SELECT 
      *,
      wpmdc.id as id,
      wpmd.id as work_permit_detail_id,
      person_certificates.certificate_no as certificate_no
      FROM work_permit_detail_confine wpmdc
      INNER JOIN work_permit_detail wpmd ON wpmd.id = wpmdc.work_permit_detail_id
      INNER JOIN work_permit_detail_confine_verified wpmdcv ON wpmdcv.work_permit_id = wpmd.work_permit_id
      LEFT JOIN person_certificates ON person_certificates.person_id = wpmdc.person_id
      WHERE wpmdcv.work_permit_id = ?
      GROUP BY wpmdc.id
    `,
    [work_permit_id]
  );

  const sqlQuestions = `
    SELECT 
    work_permit_detail_item.id as id,
    work_permit_questions.id as work_permit_question_id,
    work_permit_detail_item.value as value,
    work_permit_type.name as work_permit_type_name,
    work_permit_confine_types.id as work_permit_confine_type_id,
    work_permit_confine_types.name as work_permit_confine_type_name,
    work_permit_questions.title as work_permit_question_title,
    work_permit_detail_item.approved_role as approved_role
    FROM work_permit_detail_item 
    LEFT JOIN work_permit_type ON work_permit_type.id = work_permit_detail_item.work_permit_type_id
    LEFT JOIN work_permit_questions ON work_permit_questions.id = work_permit_detail_item.work_permit_question_id
    LEFT JOIN work_permit_confine_types ON work_permit_confine_types.id = work_permit_questions.work_permit_confine_type_id
    WHERE work_permit_detail_id = ?
  `;
  const [
    rowsWorkPermitDetailItems,
    fieldsWorkPermitDetailItems,
  ] = await db.query(sqlQuestions, [work_permit_detail_id]);

  const adminNotices = await WorkPermitAdminNotice.findAll({
    where: {
      work_permit_id: work_permit_id,
    },
  });
  const adminProtections = await WorkPermitAdminProtection.findAll({
    where: {
      work_permit_id: work_permit_id,
    },
  });
  const adminVerify = await WorkPermitAdminVerify.findAll({
    where: {
      work_permit_id: work_permit_id,
    },
  });

  res.status(200).json({
    error: false,
    notices: adminNotices,
    protections: adminProtections,
    verify: adminVerify[0],
    helpers: rowsHelpers,
    data: rows[0],
    work_permit_questions: rowsWorkPermitDetailItems,
  });
});

module.exports = router;
