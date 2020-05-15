const express = require("express");
const router = express.Router();

// connection configurations
const db = require("../utils/database");
const con = require("../src/database/database");

// For เจ้าของ work_permit
router.get("/mytasks/:user_owner_id", async (req, res, next) => {
  const sql = `SELECT 
                    *,
                    work_permit.id as id,
                    locations.name as location_name
                FROM 
                    work_permit
                LEFT OUTER JOIN locations ON locations.id =  work_permit.location_id
                WHERE 
                    work_permit.user_id = ?
                    AND statuspermit != 'active'
                    AND statuspermit != 'closed'
                ORDER BY work_permit.id DESC
                `;
  const bindParams = [req.params.user_owner_id];
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));

  return res.send({
    error: false,
    data: rows,
  });
});

// For เจ้าของ work_permit ที่ปิด job แล้ว
router.get("/mytasks/:user_owner_id/closed", async (req, res, next) => {
  const sql = `SELECT 
                    *,
                    work_permit.id as id,
                    locations.name as location_name
                FROM 
                    work_permit
                LEFT OUTER JOIN locations ON locations.id =  work_permit.location_id
                WHERE 
                    (work_permit.user_id = ? OR locations.user_owner_id = ?)
                    AND statuspermit = 'closed'
                ORDER BY work_permit.id DESC
                `;
  const bindParams = [req.params.user_owner_id, req.params.user_owner_id];
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));

  return res.send({
    error: false,
    data: rows,
  });
});

// For engineer
router.get("/engineer", async (req, res, next) => {
  const sql = `SELECT 
                    *,
                    work_permit.id as id,
                    locations.name as location_name
                FROM work_permit
                LEFT OUTER JOIN locations ON locations.id =  work_permit.location_id
                WHERE work_permit.statuspermit=?
                ORDER BY work_permit.id DESC`;
  const bindParams = ["pending"];
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));
  return res.send({
    error: false,
    data: rows,
  });
});

router.get("/verified/:user_id", (req, res, next) => {
  db.query(
    `
        SELECT 
            * ,
            locations.name as location_name,
            work_permit.id as id
            FROM work_permit_approve_detail 
            LEFT JOIN work_permit ON work_permit.id = work_permit_approve_detail.work_permit_id
            LEFT OUTER JOIN locations ON locations.id =  work_permit.location_id
            WHERE work_permit_approve_detail.user_id=? AND work_permit.statuspermit!='closed'
            ORDER BY work_permit_approve_detail.work_permit_id DESC
        `,
    [req.params.user_id],
    function (error, results, fields) {
      return res.send({
        error: false,
        data: results,
      });
    }
  );
});

// For owner
router.get("/owner/:user_owner_id", async (req, res, next) => {
  const sql = `SELECT 
                    *,
                    work_permit.id as id,
                    locations.name as location_name
                FROM work_permit
                LEFT OUTER JOIN locations ON locations.id =  work_permit.location_id
                WHERE work_permit.statuspermit=?
                AND locations.user_owner_id=?
                ORDER BY work_permit.id DESC`;
  const bindParams = ["inprocess1", req.params.user_owner_id];
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));
  return res.send({
    error: false,
    data: rows,
  });
});

// For admin
router.get("/nurse", async (req, res, next) => {
  const sql = `SELECT 
                    *,
                    work_permit.id as id,
                    locations.name as location_name
                FROM 
                    work_permit
                    LEFT OUTER JOIN locations ON locations.id = work_permit.location_id
                WHERE 
                    statuspermit=? AND nurse_checked != 1
                ORDER BY work_permit.id DESC`;
  const bindParams = ["inprocess2"];
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));
  if (rows.length > 0) {
    let resultsWithNurseChecked = rows.filter((el) => {
      let permit_enable = JSON.parse(el.permit_enable);
      return permit_enable.confinework == true;
    });

    return res.send({
      error: false,
      data: resultsWithNurseChecked,
    });
  }
  res.send({
    error: false,
    data: rows,
  });
});

// For admin
router.get("/admin", async (req, res, next) => {
  const sql = `SELECT 
                    *,
                    work_permit.id as id,
                    locations.name as location_name
                FROM 
                    work_permit
                    LEFT OUTER JOIN locations ON locations.id = work_permit.location_id
                WHERE 
                    statuspermit='inprocess2'
                ORDER BY work_permit.id DESC`;
  const bindParams = ["inprocess2"];
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));
  if (rows.length > 0) {
    let permit_enable = JSON.parse(rows[0].permit_enable);
    let resultsWithNurseChecked = rows.filter((el) => {
      return el.nurse_checked == true || permit_enable.confinework === false;
    });
    return res.send({
      error: false,
      data: resultsWithNurseChecked,
    });
  }
  return res.send({
    error: false,
    data: rows,
  });
});

// For manager
router.get("/manager", async (req, res, next) => {
  const sql = ` SELECT 
                    *,
                    work_permit.id as id,
                    locations.name as location_name
                FROM 
                    work_permit
                    LEFT OUTER JOIN locations ON locations.id = work_permit.location_id
                WHERE 
                    statuspermit=?
                ORDER BY work_permit.id DESC`;
  const bindParams = ["inprocess3"];
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));
  return res.send({
    error: false,
    data: rows,
  });
});

module.exports = router;
