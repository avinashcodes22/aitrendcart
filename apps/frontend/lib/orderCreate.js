const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createOrder(token, address) {
  if (!token) throw new Error("Missing auth token");

  const res = await fetch(`${API}/api/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ address })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Order creation failed");
  }

  return res.json();
}
