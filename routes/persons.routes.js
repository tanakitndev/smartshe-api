const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error");

// connection configurations
const db = require("../src/database/database");

// For เจ้าของ work_permit
router.get("/", async (req, res, next) => {
  const sql = `SELECT
                    *,
                    persons.id as id
                FROM persons
                LEFT OUTER JOIN person_certificates pc ON pc.person_id = persons.id
                WHERE persons.del_flg='0'
                ORDER BY persons.id DESC
                `;
  const bindParams = null;
  const [rows, fields] = await db
    .query(sql, bindParams)
    .catch(err => next(err));

  return res.send({
    error: false,
    data: rows
  });
});

router.get("/:id", async (req, res, next) => {
  const sql = `SELECT
                    *,
                    persons.id as id
                FROM persons
                LEFT OUTER JOIN person_certificates pc ON pc.person_id = persons.id
                WHERE persons.id=?
                AND persons.del_flg='0'
                LIMIT 0,1
                `;
  const bindParams = [req.params.id];
  const [rows, fields] = await db
    .query(sql, bindParams)
    .catch(err => next(err));
  const person = rows[0];

  if (!person) {
    return next(new HttpError("Person id is not found!", 404));
  }

  return res.send({
    error: false,
    data: person
  });
});

router.post("/", async (req, res, next) => {
  const sql = `INSERT INTO persons SET ?`;
  const values = {
    name: req.body.first_name + " " + req.body.last_name,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone_no: req.body.phone_no,
    position: req.body.position
  };
  const [rows, fields] = await db.query(sql, values).catch(err => {
    return res.json({
      err: true,
      message: err.message
    });
  });

  const sqlInsertCertificates = `INSERT INTO person_certificates SET ?`;
  const valuesCertificates = {
    person_id: rows.insertId,
    certificate_no: req.body.certificate_no,
    // certificate_at: req.body.certificate_at,
    is_approver: req.body.certificate_checklist.is_approver ? "1" : "0",
    is_conservator: req.body.certificate_checklist.is_conservator ? "1" : "0",
    is_performer: req.body.certificate_checklist.is_performer ? "1" : "0",
    is_helper: req.body.certificate_checklist.is_helper ? "1" : "0"
  };
  const [rowsCert, fieldsCert] = await db.query(
    sqlInsertCertificates,
    valuesCertificates
  );

  return res.send({
    error: false,
    data: rows
  });
});

router.put("/update/:id", async (req, res, next) => {
  const sql = `UPDATE persons SET ? WHERE ?`;
  const values = {
    // ...req.body.person,
    first_name: req.body.person.first_name,
    last_name: req.body.person.last_name,
    phone_no: req.body.person.phone_no,
    name: req.body.person.first_name + " " + req.body.person.last_name
  };
  const bindParams = [values, { id: req.params.id }];
  const [rows, fields] = await db
    .query(sql, bindParams)
    .catch(err => next(err));

  const sqlUpdateCert = `UPDATE person_certificates SET ? WHERE ?`;
  const valsCert = {
    is_approver: req.body.person.is_approver ? req.body.person.is_approver: "0",
    is_conservator: req.body.person.is_conservator ? req.body.person.is_conservator : "0",
    is_performer: req.body.person.is_performer ? req.body.person.is_performer : "0",
    is_helper: req.body.person.is_helper ? req.body.person.is_helper : "0"
  };
  
  const bindUpdateCert = [valsCert, { person_id: req.body.person.id }];
//   console.log(valsCert,bindUpdateCert);
  const [rowsCert, fieldsCert] = await db.query(sqlUpdateCert, bindUpdateCert);

  return res.send({
    error: false,
    data: rows,
    dataCert: req.body.person.id
  });
});

router.post("/deletes", async (req, res, next) => {
  //   const sql = `UPDATE persons SET del_flg='1' WHERE id IN (?); UPDATE person_certificates SET del_flg='1' WHERE person_id IN (?)`;
  const sql = `DELETE FROM person_certificates WHERE person_id IN (?); DELETE FROM persons WHERE id IN (?)`;
  const bindParams = [req.body.ids, req.body.ids];
  const [rows, fields] = await db
    .query(sql, bindParams)
    .catch(err => next(err));

  return res.send({
    error: false,
    data: rows
  });
});

module.exports = router;
