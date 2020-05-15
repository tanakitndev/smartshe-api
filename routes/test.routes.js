const express = require("express");
const router = express.Router();

// connection configurations
const db = require("../utils/database");
const myDB = require("../src/database/database");

const bcrypt = require("bcryptjs");

const Location = require("../src/models/Location");
const Player = require("../src/models/Player");

router.get("/", (req, res, next) => {
  db.connect(function (err) {
    if (
      err.message !==
      "Cannot enqueue Handshake after already enqueuing a Handshake."
    ) {
      return next(err);
    }
    res.status(200).json({
      status: true,
      message: "Database connected!",
    });
  });
});

router.get("/owner", async (req, res, next) => {
  // let player_ids = [];
  // let permit_enable = JSON.parse(
  //   `{"hotwork":false,"heightwork":false,"confinework":true}`
  // );

  // if (permit_enable.confinework) {
  //   const players = await Player.findAll({
  //     where: {
  //       n_approve: "nurse",
  //     },
  //   });

  //   for (let i in players) {
  //     player_ids.push(players[i].player_id);
  //   }
  //   const notification = {
  //     contents: {
  //       en: `รายละเอียด: ${rowsWorkPermit[0].description}`,
  //       th: `รายละเอียด: ${rowsWorkPermit[0].description}`,
  //       // subtitle: "มีรายการรออนุมัติ 1 รายการ",
  //     },
  //     //   included_segments: ["Subscribed Users"],
  //     //   included_segments: ["Active Users"],
  //     //   data:  {'abc': '123','test': 'haha'}
  //     include_player_ids: player_ids,
  //   };

  //   push_notify(notification, async () => {
  //     // loop engineer_player_ids
  //     for (let i in player_ids) {
  //       await Notification.create({
  //         title: `รายละเอียด: ${rowsWorkPermit[0].description}`,
  //         subtitle: `รายละเอียด: ${rowsWorkPermit[0].description}`,
  //         player_id: player_ids[i],
  //         work_permit_id: work_permit_id,
  //       });
  //     }
  //   });
  // }

  res.json({
    player_ids,
  });
});

router.get("/reset-work-permit-all", async (req, res, next) => {
  const work_permit_detail_item = await myDB
    .query("DELETE FROM work_permit_detail_item")
    .catch((err) => next(err));
  const work_permit_detail_confine = await myDB
    .query("DELETE FROM work_permit_detail_confine")
    .catch((err) => next(err));
  const work_permit_detail = await myDB
    .query("DELETE FROM work_permit_detail")
    .catch((err) => next(err));
  const work_permit_approve_detail = await myDB
    .query("DELETE FROM work_permit_approve_detail")
    .catch((err) => next(err));
  const work_permit = await myDB
    .query("DELETE FROM work_permit")
    .catch((err) => next(err));
  const work_permit_iamges = await myDB
    .query("DELETE FROM work_permit_images")
    .catch((err) => next(err));
  res.status(200).json({
    work_permit_detail_item,
    work_permit_detail_confine,
    work_permit_detail,
    work_permit_approve_detail,
    work_permit,
    work_permit_iamges,
  });
});

router.post("/seed-location", async (req, res, next) => {
  const data = [
    {
      id: 1,
      name: "โร่งฉ่ำ LAB",
      coordinate: { lat: 14.782742655517051, lng: 101.95667148763852 },
    },
    {
      id: 2,
      name: "สำนักงานธุรการ AM",
      coordinate: { lat: 14.782724817358577, lng: 101.95717287541625 },
    },
    {
      id: 3,
      name: "ห้องปฏิบัติการ LAB",
      coordinate: { lat: 14.782885821919047, lng: 101.95674789636058 },
    },
    {
      id: 4,
      name: "ศูนญ์เล่นและเรียนรู้ AM",
      coordinate: { lat: 14.783006762184243, lng: 101.95636310361256 },
    },
    {
      id: 5,
      name: "สำนักงานขายหน้าร้าน SA",
      coordinate: { lat: 14.783176789207584, lng: 101.95768423505916 },
    },
    {
      id: 6,
      name: "สำนักงานวิศวกรรม EN",
      coordinate: { lat: 14.783683395030506, lng: 101.95628718452019 },
    },
    {
      id: 7,
      name: "Boiler EN",
      coordinate: { lat: 14.784191051946044, lng: 101.956401177041 },
    },
    {
      id: 8,
      name: "โกดังเชื้อเพลิง EN",
      coordinate: { lat: 14.78456601359524, lng: 101.95651785313316 },
    },
    {
      id: 9,
      name: "อาคารผลิต PD",
      coordinate: { lat: 14.783812254503793, lng: 101.95742742998999 },
    },
    {
      id: 10,
      name: "Hot Room RM",
      coordinate: { lat: 14.78373751747429, lng: 101.95772915377268 },
    },
    {
      id: 11,
      name: "Dryer RM",
      coordinate: { lat: 14.784451579824012, lng: 101.95685312205646 },
    },
    {
      id: 12,
      name: "Wet Bin RM",
      coordinate: { lat: 14.784410505592096, lng: 101.95713929011615 },
    },
    {
      id: 13,
      name: "Work House RM",
      coordinate: { lat: 14.784381282040105, lng: 101.95754130084035 },
    },
    {
      id: 14,
      name: "คูโบล่า RM",
      coordinate: { lat: 14.784481277295775, lng: 101.95757779995012 },
    },
    {
      id: 15,
      name: "โกดังวัตถุดิบ RM",
      coordinate: { lat: 14.784053678791823, lng: 101.95692343400917 },
    },
    {
      id: 16,
      name: "ทางเท C RM",
      coordinate: { lat: 14.784801877152693, lng: 101.9573069898983 },
    },
    {
      id: 17,
      name: "ทางเท O RM",
      coordinate: { lat: 14.784510118999798, lng: 101.95779667596555 },
    },
    {
      id: 18,
      name: "ถัง M101 RM",
      coordinate: { lat: 14.784038118313271, lng: 101.95791737537122 },
    },
    {
      id: 19,
      name: "ถัง M102 RM",
      coordinate: { lat: 14.784187239520183, lng: 101.957966996238 },
    },
    {
      id: 20,
      name: "ถัง M103 RM",
      coordinate: { lat: 14.784318206756547, lng: 101.95802332262731 },
    },
    {
      id: 21,
      name: "ถัง M104 RM",
      coordinate: { lat: 14.784096470102085, lng: 101.95775241951681 },
    },
    {
      id: 22,
      name: "ถัง M105 RM",
      coordinate: { lat: 14.78423521762584, lng: 101.95779801707006 },
    },
    {
      id: 23,
      name: "ถัง M106 RM",
      coordinate: { lat: 14.784368778242511, lng: 101.95783825020528 },
    },
    {
      id: 24,
      name: "ถัง D101 RM",
      coordinate: { lat: 14.784175569168545, lng: 101.95756064157224 },
    },
    {
      id: 25,
      name: "ถัง D102 RM",
      coordinate: { lat: 14.784313019936802, lng: 101.95761160354353 },
    },
    {
      id: 26,
      name: "ถัง D103 RM",
      coordinate: { lat: 14.784450470618035, lng: 101.95765720109678 },
    },
    {
      id: 27,
      name: "ถัง D104 RM",
      coordinate: { lat: 14.784241386933328, lng: 101.9573954097371 },
    },
    {
      id: 28,
      name: "ถัง D105 RM",
      coordinate: { lat: 14.784390270064018, lng: 101.95744934228773 },
    },
    {
      id: 29,
      name: "ถัง D106 RM",
      coordinate: { lat: 14.784500489917608, lng: 101.9574788465869 },
    },
    {
      id: 30,
      name: "ถัง D107 RM",
      coordinate: { lat: 14.78511872361861, lng: 101.95764140858196 },
    },
    {
      id: 31,
      name: "ถัง D108 RM",
      coordinate: { lat: 14.785315821950093, lng: 101.95770846380734 },
    },
    {
      id: 32,
      name: "ถัง D109 RM",
      coordinate: { lat: 14.78504351499759, lng: 101.9578814662888 },
    },
    {
      id: 33,
      name: "ถัง D110 RM",
      coordinate: { lat: 14.785244503495539, lng: 101.9579510818418 },
    },
    {
      id: 34,
      name: "ถัง D111 RM",
      coordinate: { lat: 14.784970899752565, lng: 101.9581307898458 },
    },
    {
      id: 35,
      name: "โรงขยะ AM",
      coordinate: { lat: 14.785208195909693, lng: 101.95717055901846 },
    },
    {
      id: 36,
      name: "โรงไม้ AM",
      coordinate: { lat: 14.78319392371295, lng: 101.95855091096577 },
    },
    {
      id: 37,
      name: "หอพัก 1 AM",
      coordinate: { lat: 14.783435111942985, lng: 101.95862601281819 },
    },
    {
      id: 38,
      name: "หอพัก 2 AM",
      coordinate: { lat: 14.7828593718535, lng: 101.95839266063389 },
    },
    {
      id: 39,
      name: "อสร. F6",
      coordinate: { lat: 14.783437705363367, lng: 101.9572232175034 },
    },
    {
      id: 40,
      name: "ลานจอดรถส่วนบุคคล AM",
      coordinate: { lat: 14.78229615671265, lng: 101.95778142083199 },
    },
    {
      id: 41,
      name: "ลานจอดรถวัตถุดิบ AM",
      coordinate: { lat: 14.782428506886074, lng: 101.95658612274777 },
    },
  ];

  let bindParams = [];
  for (let i in data) {
    let set = [];
    set.push(data[i].name);
    set.push(data[i].coordinate.lat.toString());
    set.push(data[i].coordinate.lng.toString());
    set.push(1);
    set.push(3);
    bindParams.push(set);
  }
  const location = await myDB
    .query(
      "INSERT INTO locations (name,lat,lng,department_id,user_owner_id) VALUES ?",
      [bindParams]
    )
    .catch((err) => next(err));
  res.status(200).json({
    location,
  });
});

router.get("/hash_pass_all", async (req, res, next) => {
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);
  // password_hash: hashedPassword,
  const sql = `SELECT * FROM user`;
  const [rows, fields] = await myDB.query(sql, null);
  for (let i in rows) {
    if (rows[i].password_hash === "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rows[i].password, salt);
      const updatedPassword = myDB.query(
        "UPDATE user SET password_hash=? WHERE id=?",
        [hashedPassword, rows[i].id]
      );
    }
  }
  res.status(200).json({
    rows,
  });
});

router.get("/test-cookie", (req, res) => {
  const token = "1234";
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
  });
});
module.exports = router;
