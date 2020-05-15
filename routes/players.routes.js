const express = require("express");
const router = express.Router();

// connection configurations
const con = require("../src/database/database");

const Player = require("../src/models/Player");

router.get("/", async (req, res, next) => {
  const sql = `SELECT * FROM players`;
  const bindParams = null;
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));

  return res.send({
    error: false,
    data: rows,
  });
});

router.get("/:player_id/:n_approve", async (req, res, next) => {
  const sql = `SELECT * FROM players WHERE player_id = ? AND n_approve = ?`;
  const bindParams = [req.params.player_id, req.params.n_approve];
  const [rows, fields] = await con
    .query(sql, bindParams)
    .catch((err) => next(err));

  return res.send({
    error: false,
    data: rows,
  });
});

router.post("/", async (req, res, next) => {
  const player = await Player.create({
    player_id: req.body.player_id,
    user_id: req.body.user_id,
    n_approve: req.body.n_approve,
  }).catch((err) => {
    return res.status(404).json({
      error: true,
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
    });
  });
  return res.status(201).json({
    error: false,
    data: player,
  });
});

router.delete("/:player_id/:n_approve", async (req, res, next) => {
  await Player.destroy({
    where: {
      player_id: req.params.player_id,
      n_approve: req.params.n_approve
    },
  });

  return res.send({
    error: false,
    message: "Unsubscribe notification",
  });
});

module.exports = router;
