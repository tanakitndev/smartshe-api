const express = require("express");
const router = express.Router();
const WorkPermit = require("../src/models/WorkPermit");

router.get("/counter", async (req, res) => {
  const workPermit = await WorkPermit.findAll();
  let hotworkCount = 0;
  let heightworkCount = 0;
  let confineworkCount = 0;

  for (let i in workPermit) {
    const permit_enable = JSON.parse(workPermit[i].permit_enable);
    if (permit_enable.hotwork) {
      hotworkCount = hotworkCount + 1;
    }
    if (permit_enable.heightwork) {
      heightworkCount = heightworkCount + 1;
    }
    if (permit_enable.confinework) {
      confineworkCount = confineworkCount + 1;
    }
  }

  res.send({
    hotworkCount,
    heightworkCount,
    confineworkCount
  });
});

module.exports = router;
