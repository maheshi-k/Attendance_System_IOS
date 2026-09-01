import Joi from "joi";

export const createLeaveTypeSchema = Joi.object({
  leave_type_name: Joi.string()
    .trim()
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .max(255)
    .allow("", null),

  max_days: Joi.number()
    .positive()
    .max(999.99)
    .required(),

  is_paid: Joi.boolean()
    .default(true),

  carry_forward: Joi.boolean()
    .default(false),

  carry_forward_days: Joi.when("carry_forward", {
    is: true,
    then: Joi.number()
      .min(0)
      .max(Joi.ref("max_days"))
      .required(),
    otherwise: Joi.valid(null, 0).default(null),
  }),
});

export const updateLeaveTypeSchema = Joi.object({
  leave_type_name: Joi.string()
    .trim()
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .max(255)
    .allow("", null),

  max_days: Joi.number()
    .positive()
    .max(999.99)
    .required(),

  is_paid: Joi.boolean()
    .required(),

  carry_forward: Joi.boolean()
    .required(),

  carry_forward_days: Joi.when("carry_forward", {
    is: true,
    then: Joi.number()
      .min(0)
      .max(Joi.ref("max_days"))
      .required(),
    otherwise: Joi.valid(null, 0).default(null),
  }),
});