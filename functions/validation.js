const Joi = require('@hapi/joi');

const registerValidation = async (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),

        password: Joi.string()
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        confirm_password: Joi.ref('password'),
        displayname: Joi.string()
            .required(),
        right1: Joi.string()
            .required()
    }).with('password', 'confirm_password');;
    const results = await schema.validate(data);
    return results;
}

const loginValidation = async (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    });
    const results = await schema.validate(data);
    return results;
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;