const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const cartApi = {
  async getCart(token) {
    const res = await fetch(`${API}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  },

  async addToCart(token, productId) {
    const res = await fetch(`${API}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (!res.ok) throw new Error("Failed to add to cart");
    return res.json();
  },

  async removeFromCart(token, productId) {
    const res = await fetch(`${API}/api/cart/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (!res.ok) throw new Error("Failed to remove from cart");
    return res.json();
  },
};

export default cartApi;
