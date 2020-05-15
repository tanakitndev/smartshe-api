const express = require("express");
const router = express.Router();

// connection configurations
const db = require("../src/database/database");
const sequelize = require("../src/database/connection");
const bcrypt = require("bcryptjs");

const jwt = require("../jwt");

const {
  loginValidation,
  registerValidation
} = require("../functions/validation");

router.get("/users", async (req, res, next) => {
  const users = await sequelize.query(
    `
    SELECT 
    user.id,
    user.username,
    user.displayname,
    user.right1,
    user.right2,
    right_user.n_approve
    FROM user LEFT OUTER JOIN right_user ON right_user.sign_right = user.right1
    ORDER BY user.id DESC`,
    { type: sequelize.QueryTypes.SELECT }
  );
  // const [rows, fields] = await db.query("SELECT id,username,displayname,right1,right2 FROM user");
  res.status(200).json({
    error: false,
    data: users
  });
});

router.post("/users", async (req, res, next) => {
  const sqlInsert = `
        INSERT INTO user SET ?
    `;

  const username = req.body.username;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const displayname = req.body.displayname;
  const right1 = req.body.right1;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let values = {
    username: username,
    password: password,
    password_hash: hashedPassword,
    displayname: displayname,
    right1: right1
  };

  let message = "";
  if (password === confirm_password) {
    if (username && displayname) {
      const [rows, fields] = await db.query(sqlInsert, values).catch(err => {
        return res.status(200).json({
          error: true,
          data: err.message
        });
      });

      return res.status(200).json({
        data: req.body,
        message
      });
    } else {
      message = "Username and Displayname is required!";
      return res.json({
        error: true,
        data: [],
        message
      });
    }
  } else {
    message = "Password is not match!";
    return res.json({
      error: true,
      data: [],
      message
    });
  }

  return next();
});

router.get("/users/:user_id", async (req, res, next) => {
  const user = await sequelize.query(
    `
    SELECT 
    user.id,
    user.username,
    user.displayname,
    user.right1,
    user.right2,
    right_user.n_approve
    FROM user LEFT OUTER JOIN right_user ON right_user.sign_right = user.right1
    WHERE user.id=:user_id`,
    {
      replacements: {
        user_id: req.params.user_id
      },
      type: sequelize.QueryTypes.SELECT
    }
  );
  // const [rows, fields] = await db.query("SELECT id,username,displayname,right1,right2 FROM user");
  res.status(200).json({
    data: user
  });
});

router.get("/roles", async (req, res, next) => {
  const sqlRoles = `SELECT * FROM right_user`;
  const [rows, fields] = await db.query(sqlRoles, null);
  return res.send({
    error: false,
    data: rows
  });
});

router.post("/users/deletes", async (req, res, next) => {
  const sql = `DELETE FROM user WHERE id IN (?)`;
  const bindParams = [req.body.ids];
  const [rows, fields] = await db
    .query(sql, bindParams)
    .catch(err => next(err));

  return res.send({
    error: false,
    data: rows
  });
});

router.post("/profile", jwt.verify, async (req, res, next) => {
  const sql = `
        SELECT
        user.id as id,
        user.username as username,
        user.displayname as displayname,
        user.right1 as right1,
        right_user.n_approve as n_approve
        FROM user
        INNER JOIN right_user ON right_user.sign_right=user.right1
        WHERE  user.id=?`;
  const bindParams = [req.userId];
  const [rows, fields] = await db
    .query(sql, bindParams)
    .catch(err => next(err));

//   return res.send({
//     error: false,
//     data: rows
//   });
  return res.send({
    error: false,
    data: rows[0]
  });
});

router.post("/login", async (req, res, next) => {
  const sqlFindUsername = `
    SELECT
    *,
    user.id as id
    FROM user
    INNER JOIN right_user ON right_user.sign_right=user.right1
    WHERE username=?`;
  const bindParams = [req.body.username];
  const [users, fieldsUsers] = await db.query(sqlFindUsername, bindParams);
  if (users[0]) {
    if (bcrypt.compareSync(req.body.password, users[0].password_hash)) {
      const payload = {
        id: users[0].id,
        role: users[0].n_approve,
        username: users[0].username
      };

      let token = jwt.sign(payload); //jwt.sign(payload, "300000") 5 min 300000

      delete users[0].password;
      delete users[0].password_hash;
      return res.json({
        success: true, // for mobile versions <= 1.0.5 
        error: false,
        token,
        message: "Login successfully",
        data: users[0]
      });
    } else {
      // Invalid password
      return res.json({ error: true, message: "Invalid password" });
    }
  } else {
    return res.json({ error: true, message: "User not found" });
  }
});

router.post("/register", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const displayname = req.body.displayname;
  const right1 = req.body.right1;

  const { error, value } = await registerValidation({
    username,
    password,
    confirm_password,
    displayname,
    right1
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  const [
    rowsUsername,
    fieldsUsername
  ] = await db.query("SELECT username FROM user WHERE username=?", [username]);
  if (rowsUsername.length)
    return res.status(400).json({
      error: true,
      message: "Username already exists"
    });

  const sqlInsertUser = "INSERT INTO user SET ?";

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const values = {
    username: username,
    password: password,
    password_hash: hashedPassword,
    displayname: displayname,
    right1: right1
  };
  const [insertedUser, fieldsUser] = await db.query(sqlInsertUser, values);

  res.status(200).json({
    user: insertedUser.insertId
  });
});

module.exports = router;
