const API = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handle(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }
  return res.json();
}

export const api = {
  products: () => fetch(`${API}/api/products`).then(handle),
};
