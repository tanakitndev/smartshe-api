const express = require("express");
const router = express.Router();
const db = require("../src/database/database");
const WorkPermitDetailConfineVerify = require("../src/models/WorkPermitDetailConfineVerify");
const Joi = require("@hapi/joi");

router.get("/", async (req, res) => {
  const data = await WorkPermitDetailConfineVerify.findAll();
  res.send({
    data
  });
});

router.post("/", async (req, res) => {
  const formDataNurse = req.body.formDataNurse;
  const work_permit_id = req.body.work_permit_id;
  let allData = [];

  for (let i in formDataNurse) {
    const data = await WorkPermitDetailConfineVerify.create({
      work_permit_id: work_permit_id,
      person_id: formDataNurse[i].person_id,
      press: formDataNurse[i].press,
      pulse: formDataNurse[i].pulse,
      history: formDataNurse[i].history
    });
    allData.push(data);
  }

  res.send({
    allData
  });
  //   const schema = Joi.object({
  //     person_id: Joi.number().required(),
  //     press: Joi.string().required(),
  //     pulse: Joi.string().required(),
  //     history: Joi.string().required()
  //   });

  //   const { value, error } = schema.validate(req.body);

  //   if (error) {
  //     return res.send({
  //       error: true,
  //       message: error.details[0].message
  //     });
  //   }

  //   try {
  //     const { value, err } = await schema.validateAsync(req.body);
  //     return res.send({
  //       value,
  //       err
  //     });
  //   } catch (err) {
  //     return res.send({
  //       err
  //     });
  //   }
});

module.exports = router;
