const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");

const WorkPermitAdminProtection = require("../src/models/WorkPermitAdminProtection");

router.get("/", async (req, res) => {
  const workPermitAdminProtections = await WorkPermitAdminProtection.findAll();
  res.send({
    message: "work permit admin protections",
    data: workPermitAdminProtections
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

  const protections = req.body.protections;
  for (let i in protections) {
    await WorkPermitAdminProtection.create({
      work_permit_id: req.body.work_permit_id,
      user_id: req.body.user_id,
      title: protections[i]
    });

  }

  res.send({
    error: false
  });
});


module.exports = router;