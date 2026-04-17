import Product from "../models/Product.js";
import { addConvertJob } from "../ai/queue/convertQueue.js";

/* ===============================
FETCH PRODUCTS
=============================== */

export const fetchProducts = async ({
supplier,
limit = 50
}) => {

const query = {};

if (supplier)
query.supplier = supplier;

const safeLimit =
Number(limit) > 0
? Number(limit)
: 50;

return Product.find(query)
.sort({ createdAt: -1 })
.limit(safeLimit)
.lean();

};

/* ===============================
FETCH PRODUCT BY SLUG
=============================== */

export const fetchProductBySlug =
async (slug) => {

return Product
.findOne({ slug })
.lean();

};

/* ===============================
CREATE PRODUCT
=============================== */

export const createProduct =
async (data) => {

return Product.create(data);

};

/* ===============================
UPDATE PRODUCT
=============================== */

export const updateProductBySlug =
async (slug, data) => {

return Product.findOneAndUpdate(
{ slug },
data,
{ new: true }
);

};

/* ===============================
DELETE PRODUCT
=============================== */

export const deleteProductBySlug =
async (slug) => {

return Product.findOneAndDelete(
{ slug }
);

};

/* ===============================
REQUEST AI 3D CONVERSION
=============================== */

export const request3DConversion =
async (slug) => {

const product =
await Product.findOne({ slug });

if (!product)
throw new Error(
"Product not found"
);

if (
!product.images ||
product.images.length === 0
)
throw new Error(
"Product has no images"
);

/* prevent duplicate jobs */

if (
product.conversionStatus ===
"queued" ||
product.conversionStatus ===
"pending"
) {
return product;
}

const imageUrl =
product.images[0];

product.conversionStatus =
"queued";

await product.save();

await addConvertJob(
product._id,
imageUrl,
"preview"
);

return product;

};

/* ===============================
TOGGLE AR PERMISSION
=============================== */

export const toggleARPermission =
async (slug, isARAllowed) => {

return Product.findOneAndUpdate(
{ slug },
{ isARAllowed },
{ new: true }
);

};
