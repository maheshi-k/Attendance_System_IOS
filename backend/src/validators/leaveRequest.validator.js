import Joi from "joi";

export const createLeaveRequestSchema = Joi.object({
  leave_type_id: Joi.number()
    .integer()
    .positive()
    .required(),

  start_date: Joi.date()
    .iso()
    .required(),

  end_date: Joi.date()
    .iso()
    .min(Joi.ref("start_date"))
    .required(),

  reason: Joi.string()
    .trim()
    .max(500)
    .allow("", null),
});