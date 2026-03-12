/* =====================================================
   AI EMAIL MARKETING ENGINE
===================================================== */

export function generateMarketingEmail(product){

  const name = product.name || "Product";

  const subject =
    `🔥 Trending Now: ${name}`;

  const body =
    `Hello,\n\n` +
    `A new trending product just arrived: ${name}.\n\n` +
    `Customers are loving it and stock may run out soon.\n\n` +
    `Check it out today and upgrade your style!\n\n` +
    `– AItrendcart Team`;

  return {
    subject,
    body
  };

}