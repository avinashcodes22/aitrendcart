import { auth } from "../lib/firebase";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

/* ===============================
   GET FIREBASE TOKEN (SAFE)
=============================== */
async function getToken() {
  const user = auth.currentUser;

  if (!user) return null;

  try {
    return await user.getIdToken(true); // always fresh
  } catch (err) {
    console.error("Token error:", err);
    return null;
  }
}

/* ===============================
   GENERIC REQUEST (SAFE)
=============================== */
async function request(path, options = {}) {

  const token = await getToken();

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    if (!res.ok) throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data?.error || `API error (${res.status})`);
  }

  return data;
}

/* ===============================
   🔥 GLOBAL NORMALIZER (KEY FIX)
=============================== */
function normalize(type, data) {

  if (!data) return [];

  switch (type) {

    case "products":
      return data.map(p => ({
        ...p,
        name: p.name || p.title || "Unnamed Product",
        price: p.price ?? p.sellingPrice ?? 0,
      }));

    case "orders":
      return data.map(o => ({
        ...o,
        total: o.total ?? o.amount ?? 0,
        status: o.status || "pending",
      }));

    case "ai-decisions":
      return data.map(d => ({
        ...d,
        type: d.type || d.category || "AI",
        reason: d.reason || d.description || "",
        status: d.status || "pending",
      }));

    case "ai-executions":
      return data.map(e => ({
        ...e,
        engine: e.engine || "AI",
        action: e.action || e.task || "Unknown",
        status: e.status || "pending",
      }));

    case "pricing":
      return data.map(p => ({
        ...p,
        name: p.name || p.productName || "Unknown Product",
        oldPrice: p.oldPrice ?? p.price ?? 0,
        newPrice: p.newPrice ?? p.suggestedPrice ?? 0,
      }));

    case "restock":
      return data.map(r => ({
        ...r,
        productName: r.productName || r.name || "Unknown",
        currentStock: r.currentStock ?? r.stock ?? 0,
        reorderQty: r.reorderQty ?? r.qty ?? 0,
        estimatedCost: r.estimatedCost ?? r.cost ?? 0,
      }));

    case "inventory":
      return data.map(i => ({
        ...i,
        product: i.product || i.name || "Unknown",
        status: i.status || "Unknown",
      }));

    default:
      return data;
  }
}

/* ===============================
   CART API
=============================== */
export const cartApi = {
  getCart: () => request("/api/cart"),
  addToCart: (productId) =>
    request("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  removeFromCart: (productId) =>
    request("/api/cart/remove", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
};

/* ===============================
   PRODUCTS
=============================== */
export const productsApi = {
  getAll: async () => {
    const res = await request("/api/products");
    return normalize("products", res);
  },
  getOne: (slug) => request(`/api/products/${slug}`),
};

/* ===============================
   ORDERS
=============================== */
export const ordersApi = {
  create: (address) =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify({ address }),
    }),
  myOrders: async () => {
    const res = await request("/api/orders/my");
    return normalize("orders", res);
  },
};

/* ===============================
   ADMIN CORE
=============================== */
export const adminApi = {
  stats: () => request("/api/admin/stats"),
};

/* ===============================
   AI ADMIN (FULL + NORMALIZED)
=============================== */
export const adminAI = {

  workerStatus: () => request("/api/admin/worker-status"),

  healthLogs: () => request("/api/admin/ai-health"),

  decisions: async () => {
    const res = await request("/api/admin/ai-decisions");
    return normalize("ai-decisions", res?.decisions || res);
  },

  approveDecision: (id) =>
    request(`/api/admin/ai-decisions/${id}/approve`, {
      method: "POST",
    }),

  rejectDecision: (id) =>
    request(`/api/admin/ai-decisions/${id}/reject`, {
      method: "POST",
    }),

  executions: async () => {
    const res = await request("/api/admin/ai-executions");
    return {
      executions: normalize("ai-executions", res?.executions || [])
    };
  },

  /* ===============================
     AI INSIGHTS
  =============================== */

  restock: async () => {
    const res = await request("/api/admin/restock-ai");
    return normalize("restock", res);
  },

  inventory: async () => {
    const res = await request("/api/admin/inventory-ai");
    return normalize("inventory", res);
  },

  pricing: async () => {
    const res = await request("/api/admin/pricing-ai");
    return normalize("pricing", res);
  },

  executeRestock: (payload) =>
    request("/api/admin/restock/execute", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  applyPrice: (payload) =>
    request("/api/admin/pricing/execute", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export default {
  cartApi,
  productsApi,
  ordersApi,
  adminApi,
  adminAI,
};