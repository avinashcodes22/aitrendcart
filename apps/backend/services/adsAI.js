/* =====================================================
   AI ADS GENERATOR
===================================================== */

export function generateAds(product){

  const name = product.name || "Product";

  const headline =
    `🔥 ${name} – Trending Now`;

  const description =
    `Upgrade your style with the ${name}. ` +
    `One of the fastest growing products right now.`;

  const keywords = [];

  if(name.toLowerCase().includes("jacket"))
    keywords.push("streetwear jacket","fashion jacket");

  if(name.toLowerCase().includes("shoe"))
    keywords.push("sneakers","trending shoes");

  if(name.toLowerCase().includes("led"))
    keywords.push("neon fashion","cyberpunk style");

  keywords.push("trending fashion","new arrival");

  return {

    headline,
    description,
    keywords

  };

}