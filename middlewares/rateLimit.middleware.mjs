import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10, // per minute
  message: "Too many requests, try again later.",
});
