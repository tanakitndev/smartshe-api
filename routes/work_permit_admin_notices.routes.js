const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");

const WorkPermitAdminNotice = require("../src/models/WorkPermitAdminNotice");

router.get("/", async (req, res) => {
  const workPermitAdminNotice = await WorkPermitAdminNotice.findAll();
  res.send({
    message: "work permit admin notices",
    data: workPermitAdminNotice
  });
});

router.post("/", async (req, res) => {
  const schema = Joi.object({
    work_permit_id: Joi.number().required(),
    user_id: Joi.number().required()
  });

  const { value, error } = schema.validate({
    work_permit_id: req.body.work_permit_id,
    user_id: req.body.user_id
  });

  if (error) {
    return res.send({
      error: true,
      message: error.details[0].message
    });
  }

  const notices = req.body.notices;
  for (let i in notices) {
    await WorkPermitAdminNotice.create({
      work_permit_id: req.body.work_permit_id,
      user_id: req.body.user_id,
      title: notices[i]
    });

  }

  res.send({
    error: false
  });
});

module.exports = router;
