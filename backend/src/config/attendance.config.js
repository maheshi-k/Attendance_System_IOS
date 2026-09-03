import dotenv from "dotenv";
dotenv.config();

export const ATTENDANCE_CONFIG = {
  WORK_START_TIME: process.env.WORK_START_TIME,
  GRACE_PERIOD_MINUTES: Number(process.env.GRACE_PERIOD_MINUTES),
  MIN_CHECKOUT_HOURS: Number(process.env.MIN_CHECKOUT_HOURS),
};