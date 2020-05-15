const express = require("express");
const router = express.Router();

const WorkPermitAdminVerify = require("../src/models/WorkPermitAdminVerify");

const Joi = require("@hapi/joi");

router.get("/", async (req, res) => {
  const workPermitAdminVerify = await WorkPermitAdminVerify.findAll();
  res.send({
    data: workPermitAdminVerify,
    message: "work permit admin verifies"
  });
});

router.post("/", async (req, res) => {
  const schema = Joi.object({
    work_permit_id: Joi.number().required(),
    // gas: Joi.string().required(),
    // steam: Joi.string().required(),
    // spray: Joi.string().required(),
    // dust: Joi.string().required(),
    oxygen: Joi.string().required(),
    gas: Joi.string().required(),
    h2s: Joi.string().required(),
    co: Joi.string().required(),
    user_id: Joi.number().required()
  });

  const { value, error } = schema.validate(req.body);

  if (error) {
    return res.send({
      error: true,
      message: error.details[0].message
    });
  }

  const workPermitAdminVerify = await WorkPermitAdminVerify.create(req.body);

  res.send({
    error: false,
    data: workPermitAdminVerify
  });
});

module.exports = router;
