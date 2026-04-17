import rateLimit from "express-rate-limit";

/* ====================================
PUBLIC API LIMITER
==================================== */

export const publicLimiter = rateLimit({

windowMs: 15 * 60 * 1000,

max: 200,

standardHeaders: true,

legacyHeaders: false,

message: {
error: "Too many requests. Please try again later."
}

});

/* ====================================
ADMIN LIMITER
==================================== */

export const adminLimiter = rateLimit({

windowMs: 15 * 60 * 1000,

max: 1000,

standardHeaders: true,

legacyHeaders: false

});

/* ====================================
LOGIN PROTECTION
==================================== */

export const loginLimiter = rateLimit({

windowMs: 10 * 60 * 1000,

max: 20,

message: {
error: "Too many login attempts. Try again later."
}

});

/* ====================================
ORDER PROTECTION
==================================== */

export const orderLimiter = rateLimit({

windowMs: 1 * 60 * 1000,

max: 30,

message: {
error: "Order rate limit exceeded."
}

});

/* ====================================
AI CONVERSION PROTECTION
==================================== */

export const aiLimiter = rateLimit({

windowMs: 1 * 60 * 1000,

max: 5, // only 5 AI jobs per minute per admin

standardHeaders: true,

legacyHeaders: false,

message: {
error: "AI conversion limit exceeded. Please wait."
}

});
