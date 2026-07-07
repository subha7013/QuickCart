import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // matches frontend product id (e.g. "c1", "grocery1")
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: "" },
  price: { type: Number, required: true },
  image: { type: String, default: "" },
  stock: { type: Number, required: true, default: 0, min: 0 },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
