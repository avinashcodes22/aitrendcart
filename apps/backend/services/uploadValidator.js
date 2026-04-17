export function validateUpload(file) {

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "model/gltf-binary"
  ];

  if (!allowed.includes(file.mimetype)) {
    throw new Error("Invalid file type");
  }

  /* limit size */

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File too large");
  }

}