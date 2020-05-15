const express = require("express");
const router = express.Router();

// connection configurations
const db = require("../src/database/database");

// For เจ้าของ work_permit
router.get("/", async (req, res, next) => {
  const sql = `
    SELECT 
    lc.id as location_id,
    dpm.id as department_id,
    lc.name as location_name,
    dpm.department as department_name,
    lc.lat as lat,
    lc.lng as lng,
    dpm.building_code as building_code,
    lc.user_owner_id as user_owner_id,
    user.username as username,
    user.displayname as displayname
    FROM locations lc
    LEFT OUTER JOIN department dpm ON dpm.id = lc.department_id 
    LEFT OUTER JOIN user ON user.id = lc.user_owner_id
    GROUP BY lc.name
    ORDER BY lc.id DESC
    `;
  const bindParams = null;
  const [rows, fields] = await db
    .query(sql, bindParams)
    .catch((err) => next(err));

  return res.send({
    error: false,
    data: rows,
  });
});

router.post("/", async (req, res, next) => {
  let userOwners = req.body.user_owners;

  for (let i in userOwners) {
    const sql = `INSERT INTO locations SET ?`;
    const values = {
      name: req.body.name,
      lat: req.body.lat,
      lng: req.body.lng,
      department_id: req.body.department_id,
      user_owner_id: userOwners[i].id,
    };

    const [rows, fields] = await db.query(sql, values).catch((err) => {
      return res.json({
        err: true,
        message: err.message,
      });
    });
  }

  return res.send({
    error: false,
    data: "Insert Success",
  });
});

router.get("/users_owner", async (req, res, next) => {
  const sql = `SELECT id, username, displayname FROM user WHERE right1='OR'`;
  const [rows, fields] = await db.query(sql, null).catch((err) => {
    return res.json({
      err: true,
      message: err.message,
    });
  });

  return res.send({
    error: false,
    data: rows,
  });
});

router.get("/users_owners/:location_name", async (req, res, next) => {
  const sql = `SELECT 
    user.id as id, 
    username, 
    displayname,
    locations.id as location_id
    FROM user 
    LEFT OUTER JOIN locations ON locations.user_owner_id = user.id
    WHERE right1='OR' 
    AND locations.name = ?`;
  const [rows, fields] = await db
    .query(sql, [req.params.location_name])
    .catch((err) => {
      return res.json({
        err: true,
        message: err.message,
      });
    });

  return res.send({
    error: false,
    data: rows,
  });
});

router.put("/update/:location_id", async (req, res, next) => {
  const sql = `UPDATE locations SET ? WHERE ?`;
  // UPDATE locations
  let department_id =
    parseInt(req.body.department_name) > 0
      ? req.body.department_name
      : req.body.department_id;
  const values = {
    name: req.body.location_name,
    department_id: department_id,
    user_owner_id: req.body.user_owner_id,
  };

  const bindParams = [values, { id: req.params.location_id }];
  const [rows, fields] = await db
    .query(sql, bindParams)
    .catch((err) => next(err));

  // UPDATE building_code
  console.log(req.body);

  return res.send({
    error: false,
    data: rows,
  });
});

router.post("/deletes", async (req, res, next) => {
  const sql = `DELETE FROM locations WHERE id IN (?)`;
  const bindParams = [req.body.ids];
  const [rows, fields] = await db.query(sql, bindParams).catch((err) => {
    res.send({
      error: true,
      message: err.message,
    });
  });

  return res.send({
    error: false,
    data: rows,
  });
});

router.get("/:location_id/delete", async (req, res, next) => {
  const sql = `DELETE FROM locations WHERE id = ?`;
  const bindParams = [req.params.location_id];
  
  const [rows, fields] = await db.query(sql, bindParams).catch((err) => {
    res.send({
      error: true,
      message: err.message,
    });
  });

  return res.send({
    error: false,
    message: 'delete successfully',
  });
});

module.exports = router;
