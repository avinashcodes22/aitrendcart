export function buildMediaUrl(filePath) {

  if (!filePath) return null;

  /* already absolute */

  if (filePath.startsWith("http")) {
    return filePath;
  }

  /* normalize */

  filePath = filePath.replace(/\\/g, "/");

  return `${process.env.PUBLIC_SERVER_URL || "http://localhost:5000"}/${filePath}`;
}