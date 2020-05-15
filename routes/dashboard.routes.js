const express = require("express");
const router = express.Router();

// connection configurations
const db = require("../src/database/database");

// module.exports = router;

module.exports = function (io) {
  io.on("connection", function (socket) {
    console.log(`smartsensor_datanow connected ${new Date()}`);

    let prevDataUpdatedAt;
    let resultsSmartSensorDataNow;
    let intervalSmartSensorDataNow = setInterval(async () => {
      const [rows, fields] = await db.query(
        "SELECT * FROM smartsensor_datanow_new ORDER BY datetime DESC LIMIT 0,1",
        null
      );
      
      if (rows[0].datetime.toISOString() !== prevDataUpdatedAt) {
        prevDataUpdatedAt = rows[0].datetime.toISOString();
        resultsSmartSensorDataNow = rows;

        // Smart sensor datanow work_area
        let nodenames = [];
        const sqlNodeNames = `SELECT nodename FROM smartsensor_datanow GROUP BY smartsensor_datanow.nodename`;
        const [rowsNodename, fieldsNodename] = await db.query(
          sqlNodeNames,
          null
        );
        for (let i in rowsNodename) {
          nodenames.push(rowsNodename[i].nodename);
        }
        // let nodenames = req.body.nodenames;
        let results = [];
        for (let i in nodenames) {
          const sql = `
                        SELECT 
                        id,
                        location,
                        (SELECT value FROM smartsensor_datanow WHERE type='temp' AND nodename=? LIMIT 1) as temp,
                        (SELECT value FROM smartsensor_datanow WHERE type='humid' AND nodename=? LIMIT 1) as humid,
                        (SELECT value FROM smartsensor_datanow WHERE type='sound' AND nodename=? LIMIT 1) as sound,
                        datetime
                        FROM smartsensor_datanow
                        WHERE nodename = ? AND type NOT IN ("co","dust","ph") AND value != 'null'
                        GROUP BY smartsensor_datanow.nodename
                        LIMIT 1`;
          const bindParams = [
            nodenames[i],
            nodenames[i],
            nodenames[i],
            nodenames[i],
          ];
          const [rows, fields] = await db.query(sql, bindParams);
          if (rows[0]) {
            results.push(rows[0]);
          }
        }
        socket.volatile.emit("dashboard_work_area", results);

        // Smart sensor datanow air
        // let resultsEnvAir = [];
        // for (let i in nodenames) {
        //   const sql = `
        //             SELECT 
        //             *,
        //             id,
        //             location,
        //             (SELECT value FROM smartsensor_datanow WHERE type='dust' AND nodename=? LIMIT 1) as dust,
        //             (SELECT value FROM smartsensor_datanow WHERE type='co' AND nodename=? LIMIT 1) as co,
        //             (SELECT value FROM smartsensor_datanow WHERE type='ph' AND nodename=? LIMIT 1) as ph,
        //             datetime
        //             FROM smartsensor_datanow
        //             WHERE nodename = ? AND type NOT IN ("temp","humid","sound") AND value != 'null'
        //             GROUP BY smartsensor_datanow.nodename
        //             LIMIT 1`;
        //   const bindParams = [
        //     nodenames[i],
        //     nodenames[i],
        //     nodenames[i],
        //     nodenames[i],
        //   ];
        //   const [rows, fields] = await db.query(sql, bindParams);
        //   if (rows[0]) {
        //     resultsEnvAir.push(rows[0]);
        //   }
        // }
        const sqlAir = `SELECT * FROM smartsensor_datanow_new WHERE (co != 'null' AND dust != 'null') OR ph != 'null'`;
        // const bindParams = [nodenames[i], nodenames[i], nodenames[i], nodenames[i]];
        const [rowsAir, fieldsAir] = await db.query(sqlAir, null);
        socket.volatile.emit("dashboard_env", rowsAir);
        
      }
    }, 1000);

    let prevDataNowUpdatedAt;
    let prevDataNowUpdatedAtWpm;
    var intervalDataNow = setInterval(async () => {
      const [rowsLoopDataNow, fieldsLoopDataNow] = await db.query(
        "SELECT DateTime FROM DataNow ORDER BY DateTime DESC LIMIT 0,1",
        null
      );
      const [rowsLoopWpmTimeStamp, fieldsLoopWpmTimeStamp] = await db.query(
        "SELECT timestamp FROM work_permit ORDER BY timestamp DESC LIMIT 0,1",
        null
      );
      if (
        rowsLoopDataNow[0].DateTime.toISOString() !== prevDataNowUpdatedAt ||
        rowsLoopWpmTimeStamp[0].timestamp.toISOString() !==
          prevDataNowUpdatedAtWpm
      ) {
        prevDataNowUpdatedAt = rowsLoopDataNow[0].DateTime.toISOString();
        prevDataNowUpdatedAtWpm = rowsLoopWpmTimeStamp[0].timestamp.toISOString();

        const nodeIds = [];
        const sqlNodeIds = `SELECT NodeID FROM DataNow GROUP BY NodeID`;
        const [rowsNodeID, fieldsNodeID] = await db.query(sqlNodeIds, null);
        // SET nodeIds
        for (let i in rowsNodeID) {
          nodeIds.push(rowsNodeID[i].NodeID);
        }

        let results = [];
        for (let i in nodeIds) {
          const sql = `
                            SELECT 
                            work_permit.id as id,
                            work_permit.box_sensor as box_sensor,
                            locations.name as location_name,
                            DataNow.Location,
                            (SELECT value FROM DataNow WHERE VType='H2S' AND NodeID=${nodeIds[i]} LIMIT 1) as h2s,
                            (SELECT value FROM DataNow WHERE VType='SO2' AND NodeID=${nodeIds[i]} LIMIT 1) as humid,
                            (SELECT value FROM DataNow WHERE VType='CO' AND NodeID=${nodeIds[i]} LIMIT 1) as co,
                            (SELECT value FROM DataNow WHERE VType='O2' AND NodeID=${nodeIds[i]} LIMIT 1) as o2,
                            (SELECT value FROM DataNow WHERE VType='LEL' AND NodeID=${nodeIds[i]} LIMIT 1) as lel,
                            (SELECT value FROM DataNow WHERE VType='Temperature' AND NodeID=${nodeIds[i]} LIMIT 1) as temp,
                            (SELECT value FROM DataNow WHERE VType='Humidity' AND NodeID=${nodeIds[i]} LIMIT 1) as humid,
                            (SELECT value FROM DataNow WHERE VType='Sound' AND NodeID=${nodeIds[i]} LIMIT 1) as sound,
                            DateTime
                            FROM DataNow
                            LEFT OUTER JOIN work_permit ON work_permit.box_sensor = DataNow.NodeID
                            LEFT OUTER JOIN locations ON work_permit.location_id = locations.id
                            WHERE DataNow.NodeID = ${nodeIds[i]}
                            AND work_permit.box_sensor IS NOT NULL
                            AND work_permit.statuspermit='active'
                            GROUP BY DataNow.Location, work_permit.id`;
          // const bindParams = ['1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065'];
          const [rows, fields] = await db.query(sql, null);
          if (rows.length) {
            results.push(rows[0]);
          }
        }
        socket.volatile.emit("datanow", results);
      }
    }, 1000);

    socket.on("disconnect", function () {
      clearInterval(intervalSmartSensorDataNow);
      clearInterval(intervalDataNow);
      console.log("unsub dashboard");
    });
  });

  router.get("/work_area/fix/:nodename", async (req, res, next) => {
    const sql = `
        SELECT 
        *,
        smartsensor_datanow.id as id,
        location,
        (SELECT value FROM smartsensor_datanow WHERE type='temp' AND nodename=? LIMIT 1) as temp,
        (SELECT value FROM smartsensor_datanow WHERE type='humid' AND nodename=? LIMIT 1) as humid,
        (SELECT value FROM smartsensor_datanow WHERE type='sound' AND nodename=? LIMIT 1) as sound,
        datetime
        FROM smartsensor_datanow
        WHERE nodename = ? AND type NOT IN ("co","dust","ph") AND value != 'null'
        GROUP BY smartsensor_datanow.nodename
        LIMIT 1`;
    const bindParams = [
      req.params.nodename,
      req.params.nodename,
      req.params.nodename,
      req.params.nodename,
    ];
    const [rows, fields] = await db.query(sql, bindParams);
    return res.send({
      error: false,
      data: rows,
    });
  });

  router.get("/report-chart", async (req, res, next) => {
    const sql = `
                SELECT permit_enable,created_at, (CURDATE() - INTERVAL 7 DAY) AS diff
                FROM work_permit 
                WHERE created_at  >= CURDATE() - INTERVAL 7 DAY
                AND statuspermit='closed'
                ORDER BY created_at ASC
                `;
    const bindParams = null;
    const [rows, fields] = await db.query(sql, bindParams);
    return res.send({
      error: false,
      data: rows,
    });
  });

  router.get("/work_area/fix", async (req, res, next) => {
    let nodenames = [];
    const sqlNodeNames = `SELECT nodename FROM smartsensor_datanow GROUP BY nodename`;
    const [rowsNodename, fieldsNodename] = await db.query(sqlNodeNames, null);
    for (let i in rowsNodename) {
      nodenames.push(rowsNodename[i].nodename);
    }
    // let nodenames = req.body.nodenames;
    let results = [];
    for (let i in nodenames) {
      const sql = `
            SELECT 
            id,
            location,
            (SELECT value FROM smartsensor_datanow WHERE type='temp' AND nodename=? LIMIT 1) as temp,
            (SELECT value FROM smartsensor_datanow WHERE type='humid' AND nodename=? LIMIT 1) as humid,
            (SELECT value FROM smartsensor_datanow WHERE type='sound' AND nodename=? LIMIT 1) as sound,
            datetime
            FROM smartsensor_datanow
            WHERE nodename = ? AND type NOT IN ("co","dust","ph") AND value != 'null'
            GROUP BY smartsensor_datanow.nodename
            LIMIT 1`;
      const bindParams = [
        nodenames[i],
        nodenames[i],
        nodenames[i],
        nodenames[i],
      ];
      const [rows, fields] = await db.query(sql, bindParams);
      if (rows[0]) {
        results.push(rows[0]);
      }
    }

    return res.send({
      error: false,
      data: results,
    });
  });

  router.get("/work_area/mobile", async (req, res, next) => {
    const nodeIds = [];
    const sqlNodeIds = `SELECT NodeID FROM DataNow GROUP BY NodeID`;
    const [rowsNodeID, fieldsNodeID] = await db.query(sqlNodeIds, null);
    // SET nodeIds
    for (let i in rowsNodeID) {
      nodeIds.push(rowsNodeID[i].NodeID);
    }

    let results = [];
    for (let i in nodeIds) {
      const sql = `
            SELECT 
            work_permit.id as id,
            work_permit.box_sensor as box_sensor,
            locations.name as location_name,
            DataNow.Location,
            (SELECT value FROM DataNow WHERE VType='H2S' AND NodeID=${nodeIds[i]} LIMIT 1) as h2s,
            (SELECT value FROM DataNow WHERE VType='SO2' AND NodeID=${nodeIds[i]} LIMIT 1) as humid,
            (SELECT value FROM DataNow WHERE VType='CO' AND NodeID=${nodeIds[i]} LIMIT 1) as co,
            (SELECT value FROM DataNow WHERE VType='O2' AND NodeID=${nodeIds[i]} LIMIT 1) as o2,
            (SELECT value FROM DataNow WHERE VType='LEL' AND NodeID=${nodeIds[i]} LIMIT 1) as lel,
            (SELECT value FROM DataNow WHERE VType='Temperature' AND NodeID=${nodeIds[i]} LIMIT 1) as temp,
            (SELECT value FROM DataNow WHERE VType='Humidity' AND NodeID=${nodeIds[i]} LIMIT 1) as humid,
            (SELECT value FROM DataNow WHERE VType='Sound' AND NodeID=${nodeIds[i]} LIMIT 1) as sound,
            DateTime
            FROM DataNow
            LEFT OUTER JOIN work_permit ON work_permit.box_sensor = DataNow.NodeID
            LEFT OUTER JOIN locations ON work_permit.location_id = locations.id
            WHERE DataNow.NodeID = ${nodeIds[i]}
            AND work_permit.box_sensor IS NOT NULL
            AND work_permit.statuspermit='active'
            GROUP BY DataNow.Location, work_permit.id`;
      // const bindParams = ['1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065', '1573353257065'];
      const [rows, fields] = await db.query(sql, null);
      if (rows[0]) {
        results.push(rows[0]);
      }
    }

    return res.send({
      error: false,
      data: results,
    });
  });

  router.get("/environments/env", async (req, res, next) => {
    // let nodenames = [];
    // const sqlNodeNames = `SELECT nodename FROM smartsensor_datanow GROUP BY nodename`;
    // const [rowsNodename, fieldsNodename] = await db.query(sqlNodeNames, null);
    // for (let i in rowsNodename) {
    //   nodenames.push(rowsNodename[i].nodename);
    // }
    // let nodenames = req.body.nodenames;
    // let results = [];
    // for (let i in nodenames) {
    //   const sql = `
    //           SELECT
    //           *,
    //           id,
    //           location,
    //           (SELECT value FROM smartsensor_datanow WHERE type='dust' AND nodename=? LIMIT 1) as dust,
    //           (SELECT value FROM smartsensor_datanow WHERE type='co' AND nodename=? LIMIT 1) as co,
    //           (SELECT value FROM smartsensor_datanow WHERE type='ph' AND nodename=? LIMIT 1) as ph,
    //           datetime
    //           FROM smartsensor_datanow
    //           WHERE nodename = ? AND type NOT IN ("temp","humid","sound") AND value != 'null'
    //           GROUP BY smartsensor_datanow.nodename
    //           LIMIT 1`;
    //   const bindParams = [nodenames[i], nodenames[i], nodenames[i], nodenames[i]];
    //   const [rows, fields] = await db.query(sql, null);
    //   if (rows[0]) {
    //     results.push(rows[0]);
    //   }
    // }

    const sql = `SELECT * FROM smartsensor_datanow_new WHERE (co != 'null' AND dust != 'null') OR ph != 'null'`;
    // const bindParams = [nodenames[i], nodenames[i], nodenames[i], nodenames[i]];
    const [rows, fields] = await db.query(sql, null);
    return res.send({
      error: false,
      data: rows,
    });
  });

  return router;
};
