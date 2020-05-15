const express = require("express");
const router = express.Router();

const push_notify = require("../functions/push_notify");
// connection configurations
// const con = require("../src/database/database");

const Notification = require("../src/models/Notification");

router.get("/", async (req, res, next) => {
  const notifications = await Notification.findAll();
  return res.send({
    error: false,
    data: notifications,
  });
});

router.get("/:player_id", async (req, res, next) => {
  const notifications = await Notification.findAll({
    where: {
      player_id: req.params.player_id,
    },
  });
  return res.send({
    error: false,
    data: notifications,
  });
});

router.put("/:id", async (req, res) => {
  const notification = await Notification.update(
    {
      is_clicked: "1",
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  return res.send({
    error: false,
    data: notification,
  });
});

// router.post("/", async (req, res, next) => {
//   const player = await Player.create({
//     player_id: req.body.player_id,
//     user_id: req.body.user_id,
//     n_approve: req.body.n_approve,
//   }).catch((err) => {
//     return res.status(404).json({
//       error: true,
//       message: "กรุณากรอกข้อมูลให้ถูกต้อง"
//     });
//   });
//   return res.status(201).json({
//     error: false,
//     data: player,
//   });
// });

module.exports = router;

// push notify
// const notification = {
//   contents: {
//     en: "มีรายการรออนุมัติ",
//     th: "มีรายการรออนุมัติ",
//     // subtitle: "มีรายการรออนุมัติ 1 รายการ",
//   },
//   //   included_segments: ["Subscribed Users"],
//   //   included_segments: ["Active Users"],
//   //   data:  {'abc': '123','test': 'haha'}
//   include_player_ids: ["2bbeda85-4168-4ce2-b665-25f917beda2b"],
// };
// push_notify(notification);
