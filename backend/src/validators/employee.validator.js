import Joi from "joi";

export const createEmployeeSchema = Joi.object({
  emp_code: Joi.string()
    .trim()
    .max(20)
    .required(),

  first_name: Joi.string()
    .trim()
    .max(50)
    .required(),

  last_name: Joi.string()
    .trim()
    .max(50)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .max(100)
    .required(),

  password: Joi.string()
    .min(8)
    .max(100)
    .required(),

  role_id: Joi.number()
    .integer()
    .positive()
    .required(),

  profile_photo: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(null, ""),

  employment_status: Joi.string()
  .valid("Active", "On Leave", "Probation")
  .optional()
  .default("Active"),

  mobile_no: Joi.string()
  .pattern(/^07\d{8}$/)
  .required()
  .messages({
    'string.pattern.base': 'Mobile number must be a valid Sri Lankan mobile number'
  })
});

export const updateEmployeeSchema = Joi.object({
  first_name: Joi.string()
    .trim()
    .max(50)
    .required(),

  last_name: Joi.string()
    .trim()
    .max(50)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .max(100)
    .required(),

  password: Joi.string()
    .min(8)
    .max(100)
    .optional(),

  role_id: Joi.number()
    .integer()
    .positive()
    .required(),
  
  profile_photo: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(null, ""),

  employment_status: Joi.string()
    .valid("Active", "On Leave", "Probation")
    .required(),
  
  mobile_no: Joi.string()
  .pattern(/^07\d{8}$/)
  .required()
  .messages({
    'string.pattern.base': 'Mobile number must be a valid Sri Lankan mobile number'
  })
});