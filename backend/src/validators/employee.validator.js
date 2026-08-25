import Joi from "joi";

const designationHistorySchema = Joi.object({
  designation: Joi.string()
    .trim()
    .max(100)
    .required(),

  employment_type: Joi.string()
    .valid("Full-Time", "Part-Time", "Contract")
    .required(),

  effective_from: Joi.date()
    .iso()
    .required(),

  effective_to: Joi.date()
    .iso()
    .allow(null)
    .optional(),
});

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

  email_1: Joi.string()
    .trim()
    .email()
    .max(100)
    .required(),

  email_2: Joi.string()
    .trim()
    .email()
    .max(100)
    .optional()
    .allow(null, ""),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),

  nic: Joi.string()
    .trim()
    .pattern(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/)
    .required()
    .messages({
      "string.pattern.base":
        "NIC must be a valid Sri Lankan NIC number",
    }),

  role_id: Joi.number()
    .integer()
    .positive()
    .required(),

  employment_status: Joi.string()
    .valid("Active", "On Leave", "Probation")
    .required(),

  mobile_no_1: Joi.string()
    .pattern(/^07\d{8}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mobile number must be a valid Sri Lankan mobile number",
    }),

  mobile_no_2: Joi.string()
    .pattern(/^07\d{8}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Mobile number 2 must be a valid Sri Lankan mobile number",
    }),

  gender: Joi.string()
    .valid("Male", "Female")
    .required(),

  address: Joi.string()
    .trim()
    .max(255)
    .optional()
    .allow(null, ""),

  joining_date: Joi.date()
    .iso()
    .required(),

  designation: Joi.string().required(),

  designation_history: Joi.string().optional().allow(""),

  is_present: Joi.boolean().default(true),

  effective_to: Joi.date()
    .iso()
    .allow(null, "")
    .optional(),

  is_active: Joi.boolean(),
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

  nic: Joi.string()
    .trim()
    .pattern(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/)
    .required()
    .messages({
      "string.pattern.base":
        "NIC must be a valid Sri Lankan NIC number",
    }),

  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .required(),

  address: Joi.string()
    .trim()
    .max(255)
    .optional()
    .allow(null, ""),

  email_1: Joi.string()
    .trim()
    .email()
    .max(100)
    .required(),

  email_2: Joi.string()
    .trim()
    .email()
    .max(100)
    .optional()
    .allow(null, ""),

  password: Joi.string()
    .min(8)
    .max(100)
    .optional(),

  mobile_no_1: Joi.string()
    .pattern(/^07\d{8}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Mobile number must be a valid Sri Lankan mobile number",
    }),

  mobile_no_2: Joi.string()
    .pattern(/^07\d{8}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base":
        "Mobile number must be a valid Sri Lankan mobile number",
    }),

  joining_date: Joi.date()
    .iso()
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
    .required(),

  designation: Joi.string()
    .trim()
    .max(100)
    .required(),

  designation_history: Joi.string().optional().allow(""),

  is_present: Joi.boolean().default(true),

  effective_to: Joi.date()
    .iso()
    .allow(null, "")
    .optional(),
});