export function resolveMedia(url) {

  if (!url) return "/placeholder.png";

  if (url.startsWith("http")) return url;

  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  return `${base}/${url}`;
}