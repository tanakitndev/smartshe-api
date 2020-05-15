const express = require("express");
const router = express.Router();

// connection configurations
const db = require("../src/database/database");
const WorkPermit = require("../src/models/WorkPermit");
const Department = require("../src/models/Department");
const Location = require("../src/models/Location");
const User = require("../src/models/User");
const Player = require("../src/models/Player");
const Notification = require("../src/models/Notification");

const push_notify = require("../functions/push_notify");

router.get("/", async (req, res, next) => {
  const work_permits = await WorkPermit.findAll({
    include: [
      { model: Department, as: "departments" },
      { model: Location, as: "location" },
    ],
  }).catch((err) => {
    return next(err);
  });
  return res.send({
    error: false,
    count: work_permits.length,
    data: work_permits,
  });
});

router.get("/:work_permit_id", async (req, res, next) => {
  const rows = await WorkPermit.findAll({
    where: {
      id: req.params.work_permit_id,
    },
    include: [
      { model: Department, as: "departments" },
      { model: Location, as: "location" },
      { model: User, as: "user" },
    ],
  }).catch((err) => {
    return next(err);
  });
  return res.send({
    error: false,
    count: rows.length,
    data: rows[0],
  });
});

router.post("/", async (req, res, next) => {
  const sqlInsertWorkPermit = `
        INSERT INTO work_permit SET ?
    `;
  let values = {
    area_floor: req.body.area_floor,
    box_sensor: req.body.box_sensor,
    department_id: req.body.department_id, // building
    location_id: req.body.location_id,
    permit_enable: req.body.permit_enable,
    site: req.body.site,
    description: req.body.description,
    expires: req.body.expires,
    team: req.body.team,
    phone_no: req.body.phone_no,
    job_member: req.body.job_member,
    note: req.body.note,
    statuspermit: "pending",
    user_id: req.body.user_id,
  };
  const insertedRows = await db.query(sqlInsertWorkPermit, values);

  const work_permit_id = insertedRows[0].insertId;
  const sqlInsertWorkPermitDetail = `INSERT INTO work_permit_detail SET ?`;
  const insertWorkPermitDetail = await db.query(sqlInsertWorkPermitDetail, {
    work_permit_id: work_permit_id,
  });
  const work_permit_detail_id = insertWorkPermitDetail[0].insertId;

  let confinework_members = [];
  const { performers, conservators, helpers } = req.body.confinework_members;
  if (performers.length || conservators.length || helpers.length) {
    confinework_members = [...performers, ...conservators, ...helpers];
  }

  if (confinework_members.length > 0) {
    const sqlInsertDetailConfine = `INSERT INTO work_permit_detail_confine  (work_permit_detail_id,name,position,person_id,section) VALUES ?`;
    let work_permit_detail_confines = [];
    for (let i in confinework_members) {
      work_permit_detail_confines.push([
        work_permit_detail_id,
        confinework_members[i]["name"],
        confinework_members[i]["position"],
        confinework_members[i]["person_id"],
        confinework_members[i]["section"],
      ]);
    }
    await db.query(sqlInsertDetailConfine, [work_permit_detail_confines]);
  }

  const players = await Player.findAll({
    where: {
      n_approve: "engineer",
    },
  });
  let engineer_player_ids = [];
  players.forEach((player) => {
    engineer_player_ids.push(player["player_id"]);
  });

  const notification = {
    contents: {
      en: "มีรายการรออนุมัติ",
      th: "มีรายการรออนุมัติ",
      // subtitle: "มีรายการรออนุมัติ 1 รายการ",
    },
    //   included_segments: ["Subscribed Users"],
    //   included_segments: ["Active Users"],
    //   data:  {'abc': '123','test': 'haha'}
    include_player_ids: engineer_player_ids,
  };
  push_notify(notification, async () => {
    // loop engineer_player_ids
    for (let i in engineer_player_ids) {
      await Notification.create({
        title: "มีรายการรออนุมัติ",
        subtitle: `รายละเอียด: ${req.body.description}`,
        player_id: engineer_player_ids[i],
        work_permit_id: work_permit_id,
      });
    }
  });

  return res.status(200).json({
    data: insertedRows,
    insertWorkPermitDetail,
    confinework_members,
  });
});

router.post("/set-approve", async (req, res, next) => {
  let work_permit_id = req.body.work_permit_id;
  let user_id_approve = req.body.user_id_approve; // user id approve
  let location_id = req.body.location_id;

  // console.log("location_id", location_id); // ได้ location_id มา เพื่อหา user_owner_id

  const sqlCheckRoleName = `
    SELECT  * FROM  user INNER JOIN  right_user ON user.right1 = right_user.sign_right WHERE user.id = ?
    `;
  const [roleNames, filedsRoleNames] = await db.query(sqlCheckRoleName, [
    user_id_approve,
  ]);
  const roleName = roleNames[0].n_approve;
  // console.log(roleName);

  let department_id = req.body.department_id;
  let answers = [];
  let work_permit_detail_items = [];

  // Find work permit detail id BY work_permit_id
  const [
    rowsWorkPermitDetail,
    fieldsWorkPermitDetail,
  ] = await db.query(
    `SELECT id as work_permit_detail_id FROM work_permit_detail WHERE work_permit_id=?`,
    [work_permit_id]
  );
  let work_permit_detail_id = rowsWorkPermitDetail[0].work_permit_detail_id;
  if (roleName === "engineer" || roleName === "owner") {
    const { hotwork, heightwork, confinework } = req.body.answers;
    if (
      (hotwork && hotwork.length > 0) ||
      (heightwork && heightwork.length > 0) ||
      (confinework && confinework.length > 0)
    ) {
      answers = [...hotwork, ...heightwork, ...confinework];
    }

    for (let i in answers) {
      work_permit_detail_items.push([
        work_permit_detail_id,
        answers[i]["work_permit_type_id"],
        answers[i]["id"],
        answers[i]["answer"],
        department_id,
        roleName,
      ]);
    }

    if (answers.length) {
      // Check exist work_permit_detail_item WHERE work_permit_detail_id
      const [
        rowsWorkPermitDetailItem,
        fieldsWorkPermitDetailItem,
      ] = await db.query("SELECT * FROM work_permit_detail_item WHERE ?", [
        work_permit_detail_id,
      ]);
      // IF exist delete all WHERE work_permit_detail_id
      if (rowsWorkPermitDetailItem.length > 0) {
        await db.query(
          "DELETE FROM work_permit_detail_item WHERE work_permit_detail_id = ? AND approved_role = ?",
          [work_permit_detail_id, roleName]
        );
      }
      // INSERT work_permit_detail_item
      const sqlInsertWorkPermitDetailItem = `INSERT INTO work_permit_detail_item (work_permit_detail_id,work_permit_type_id,work_permit_question_id,value, department_id,approved_role) VALUES ?`;
      const insertWorkPermitDetailItem = await db.query(
        sqlInsertWorkPermitDetailItem,
        [work_permit_detail_items]
      );
      console.log(insertWorkPermitDetailItem);
    }
  }

  // Approve

  let approve_detail = [];
  const sqlApproveDetail = `SELECT * FROM work_permit WHERE id = ?`;
  const [rowsWorkPermit, fieldsWorkPermit] = await db.query(sqlApproveDetail, [
    work_permit_id,
  ]);

  approve_detail = rowsWorkPermit[0].approve_detail
    ? JSON.parse(rowsWorkPermit[0].approve_detail)
    : [];
  if (!approve_detail.includes(roleName)) {
    approve_detail.push(roleName);
  }
  approve_detail = JSON.stringify(approve_detail);

  const sqlUpdateWorkPermit = `UPDATE work_permit SET approve_detail=?, timestamp=? WHERE id=?`;
  const updatedWorkPermit = await db.query(sqlUpdateWorkPermit, [
    approve_detail,
    new Date(),
    work_permit_id,
  ]);

  const sqlInsertWorkPermitApproveDetail = `INSERT INTO work_permit_approve_detail SET ?`;
  let values = {
    work_permit_id: work_permit_id,
    user_id: user_id_approve,
  };

  // Insert Work Permit Detail
  const insertedWorkPermitApproveDetail = await db.query(
    sqlInsertWorkPermitApproveDetail,
    values
  );

  // Check old status
  const sqlCheckOldStatus = `SELECT statuspermit FROM work_permit WHERE id=?`;
  const [rowsOldStatus, fieldsOldStatus] = await db.query(
    sqlCheckOldStatus,
    work_permit_id
  );
  const oldStatusPermit = rowsOldStatus[0].statuspermit;
  // console.log(rowsOldStatus[0].statuspermit);

  // get roleName from user_id
  let whereParams = null;
  let player_ids = [];
  // check RoleName
  if (roleName === "engineer") {
    whereParams = {
      statuspermit: "inprocess1",
    };

    // location_id นำไปหา user_owner_id
    const location = await Location.findOne({
      where: {
        id: location_id,
      },
    });

    const locations = await Location.findAll({
      where: {
        name: location.name,
      },
    });

    // console.log('locations', locations);

    for (const i in locations) {
      const players = await Player.findAll({
        where: {
          user_id: locations[i].user_owner_id,
        },
      });

      for (const j in players) {
        player_ids.push(players[j].player_id);
      }
    }

    const notification = {
      contents: {
        en: `รายละเอียด: ${rowsWorkPermit[0].description}`,
        th: `รายละเอียด: ${rowsWorkPermit[0].description}`,
        // subtitle: "มีรายการรออนุมัติ 1 รายการ",
      },
      //   included_segments: ["Subscribed Users"],
      //   included_segments: ["Active Users"],
      //   data:  {'abc': '123','test': 'haha'}
      include_player_ids: player_ids,
    };

    push_notify(notification, async () => {
      // loop engineer_player_ids
      for (let i in player_ids) {
        await Notification.create({
          title: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          subtitle: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          player_id: player_ids[i],
          work_permit_id: work_permit_id,
        });
      }
    });

    // console.log("player_ids", player_ids);
  } else if (roleName === "owner") {
    whereParams = {
      statuspermit: "inprocess2",
    };

    let permit_enable = JSON.parse(rowsWorkPermit[0].permit_enable);
    console.log("permit_enable", permit_enable);

    if (permit_enable.confinework) {
      const players = await Player.findAll({
        where: {
          n_approve: "nurse",
        },
      });

      for (let i in players) {
        player_ids.push(players[i].player_id);
      }
      const notification = {
        contents: {
          en: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          th: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          // subtitle: "มีรายการรออนุมัติ 1 รายการ",
        },
        //   included_segments: ["Subscribed Users"],
        //   included_segments: ["Active Users"],
        //   data:  {'abc': '123','test': 'haha'}
        include_player_ids: player_ids,
      };

      push_notify(notification, async () => {
        // loop engineer_player_ids
        for (let i in player_ids) {
          await Notification.create({
            title: `รายละเอียด: ${rowsWorkPermit[0].description}`,
            subtitle: `รายละเอียด: ${rowsWorkPermit[0].description}`,
            player_id: player_ids[i],
            work_permit_id: work_permit_id,
          });
        }
      });
    } else {
      const players = await Player.findAll({
        where: {
          n_approve: "superadmin",
        },
      });
      for (let i in players) {
        player_ids.push(players[i].player_id);
      }
      const notification = {
        contents: {
          en: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          th: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          // subtitle: "มีรายการรออนุมัติ 1 รายการ",
        },
        //   included_segments: ["Subscribed Users"],
        //   included_segments: ["Active Users"],
        //   data:  {'abc': '123','test': 'haha'}
        include_player_ids: player_ids,
      };

      push_notify(notification, async () => {
        // loop engineer_player_ids
        for (let i in player_ids) {
          await Notification.create({
            title: `รายละเอียด: ${rowsWorkPermit[0].description}`,
            subtitle: `รายละเอียด: ${rowsWorkPermit[0].description}`,
            player_id: player_ids[i],
            work_permit_id: work_permit_id,
          });
        }
      });
    }
  } else if (roleName === "nurse") {
    // rowsWorkPermit[0]
    whereParams = {
      statuspermit: "inprocess2",
      nurse_checked: "1",
    };

    const players = await Player.findAll({
      where: {
        n_approve: "superadmin",
      },
    });
    for (let i in players) {
      player_ids.push(players[i].player_id);
    }
    const notification = {
      contents: {
        en: `รายละเอียด: ${rowsWorkPermit[0].description}`,
        th: `รายละเอียด: ${rowsWorkPermit[0].description}`,
        // subtitle: "มีรายการรออนุมัติ 1 รายการ",
      },
      //   included_segments: ["Subscribed Users"],
      //   included_segments: ["Active Users"],
      //   data:  {'abc': '123','test': 'haha'}
      include_player_ids: player_ids,
    };

    push_notify(notification, async () => {
      // loop engineer_player_ids
      for (let i in player_ids) {
        await Notification.create({
          title: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          subtitle: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          player_id: player_ids[i],
          work_permit_id: work_permit_id,
        });
      }
    });
  } else if (roleName === "superadmin") {
    whereParams = {
      statuspermit:
        oldStatusPermit === "active" ? oldStatusPermit : "inprocess3",
    };

    const players = await Player.findAll({
      where: {
        n_approve: "manager",
      },
    });
    for (let i in players) {
      player_ids.push(players[i].player_id);
    }
    const notification = {
      contents: {
        en: `รายละเอียด: ${rowsWorkPermit[0].description}`,
        th: `รายละเอียด: ${rowsWorkPermit[0].description}`,
        // subtitle: "มีรายการรออนุมัติ 1 รายการ",
      },
      //   included_segments: ["Subscribed Users"],
      //   included_segments: ["Active Users"],
      //   data:  {'abc': '123','test': 'haha'}
      include_player_ids: player_ids,
    };

    push_notify(notification, async () => {
      // loop engineer_player_ids
      for (let i in player_ids) {
        await Notification.create({
          title: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          subtitle: `รายละเอียด: ${rowsWorkPermit[0].description}`,
          player_id: player_ids[i],
          work_permit_id: work_permit_id,
        });
      }
    });
  } else if (roleName === "manager") {
    // statuspermit = 'active';
    whereParams = {
      statuspermit: "active",
    };
  }

  const sqlUpdateStatusPermit = `UPDATE work_permit SET ? WHERE id=?`;
  const updatedStatusPermit = await db.query(sqlUpdateStatusPermit, [
    whereParams,
    work_permit_id,
  ]);

  // push notify
  // push_notify(player_ids);

  return res.status(200).json({
    error: false,
    results: whereParams,
    message: "Updated successful",
  });
});

router.post("/reject", async (req, res, next) => {
  const work_permit_id = req.body.work_permit_id;
  const remark = req.body.remark;
  const user_id = req.body.user_id;
  const sqlRejected = `UPDATE work_permit SET ? WHERE id=?`;
  const updatedWorkPermitRejected = await db.query(sqlRejected, [
    { statuspermit: "rejected", remark: remark, timestamp: new Date() },
    work_permit_id,
  ]);

  const sqlInsertRejectedDetail = `INSERT INTO work_permit_rejected_detail SET ?`;
  const values = {
    work_permit_id: work_permit_id,
    user_id: user_id,
  };
  const insertedRejectedDetail = await db.query(
    sqlInsertRejectedDetail,
    values
  );
  return res.status(200).json({
    message: remark,
    data: updatedWorkPermitRejected,
  });
});

router.get("/history/:user_id", async (req, res, next) => {
  const sqlHistory = `SELECT * FROM work_permit WHERE statuspermit=?`;
  const updatedWorkPermitRejected = await db.query(sqlRejected, [
    { statuspermit: "rejected", remark: remark, timestamp: new Date() },
    work_permit_id,
  ]);

  const sqlInsertRejectedDetail = `INSERT INTO work_permit_rejected_detail SET ?`;
  const values = {
    work_permit_id: work_permit_id,
    user_id: user_id,
  };
  const insertedRejectedDetail = await db.query(
    sqlInsertRejectedDetail,
    values
  );
  return res.status(200).json({
    message: remark,
    data: updatedWorkPermitRejected,
  });
});

router.get("/history/:statuspermit/all", async (req, res, next) => {
  const sqlHistory = `SELECT * FROM work_permit WHERE statuspermit=?`;
  const [rows,fields] = await db.query(sqlHistory, ["closed"]);

  return res.status(200).json({
    error: false,
    data: rows,
  });
});

module.exports = router;
