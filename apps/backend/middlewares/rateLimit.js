import rateLimit from "express-rate-limit";

// For public routes like /api/products
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests, please try again later.",
});

// For admin / AI / license routes
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});
