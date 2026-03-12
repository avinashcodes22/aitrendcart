const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

/* ===============================
   GENERIC REQUEST HELPER
=============================== */
async function request(path, options = {}, token) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = "API error";
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}

/* ===============================
   CART API
=============================== */
export const cartApi = {
  getCart: (token) =>
    request("/api/cart", {}, token),

  addToCart: (token, productId) =>
    request(
      "/api/cart/add",
      {
        method: "POST",
        body: JSON.stringify({ productId }),
      },
      token
    ),

  removeFromCart: (token, productId) =>
    request(
      "/api/cart/remove",
      {
        method: "POST",
        body: JSON.stringify({ productId }),
      },
      token
    ),
};

/* ===============================
   PRODUCTS API
=============================== */
export const productsApi = {
  getAll: () => request("/api/products"),
  getOne: (slug) => request(`/api/products/${slug}`),
};

/* ===============================
   ORDERS API
=============================== */
export const ordersApi = {
  create: (token, address) =>
    request(
      "/api/orders",
      {
        method: "POST",
        body: JSON.stringify({ address }),
      },
      token
    ),

  myOrders: (token) =>
    request("/api/orders/my", {}, token),
};

/* ===============================
   ADMIN API
=============================== */
export const adminApi = {
  stats: (token) =>
    request("/api/admin/stats", {}, token),
};

export default {
  cartApi,
  productsApi,
  ordersApi,
  adminApi,
};