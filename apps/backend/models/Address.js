import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: "India" }
  },
  { timestamps: true }
);

export default mongoose.models.Address ||
  mongoose.model("Address", AddressSchema);
