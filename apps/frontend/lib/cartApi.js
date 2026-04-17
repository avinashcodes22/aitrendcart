const BASE_URL = "http://localhost:5000/api/cart";

const cartApi = {

  async addToCart(token, productId) {

    const res = await fetch(`${BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        productId
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to add to cart");
    }

    return data;
  },

  async getCart(token) {

    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to load cart");
    }

    return data;
  }

};

export default cartApi;