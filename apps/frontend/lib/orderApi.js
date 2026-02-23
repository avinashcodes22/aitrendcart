const API = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
}

export async function createOrder(token, address) {
  if (!token) {
    throw new Error("Missing auth token");
  }

  return fetch(`${API}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ address })
  }).then(handle);
}
