/* =====================================================
   AI PRODUCT CONTENT GENERATOR
===================================================== */

export function generateProductContent(name) {

  if (!name) {
    return {
      title: "",
      description: "",
      tags: []
    };
  }

  const base = name.toLowerCase();

  /* ===============================
     TITLE
  =============================== */

  const title =
    name +
    " – Premium Trending Fashion Product";

  /* ===============================
     DESCRIPTION
  =============================== */

  const description =
    `Discover the latest trend with the ${name}. ` +
    `Designed for modern style, comfort and everyday performance. ` +
    `Perfect for fashion lovers looking for something unique.`;


  /* ===============================
     TAGS
  =============================== */

  const tags = [];

  if (base.includes("jacket")) tags.push("fashion","streetwear","jacket");
  if (base.includes("shoe")) tags.push("footwear","style","sneakers");
  if (base.includes("led")) tags.push("neon","cyberpunk","led");

  tags.push("trending","new-arrival");

  return {
    title,
    description,
    tags
  };

}