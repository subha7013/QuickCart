import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    name: String,
    price: Number,
    qty: Number,
    image: String,
    category: String,
    subcategory: String,
    stock: Number,
  }],
  subtotal: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0},
  couponCode: { type: String, default: "" },
  couponDiscount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ["cod", "upi"], default: "cod" },
  upiId: { type: String, default: "" },
  address: {
    name: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
  },
  status: { type: String, enum: ["placed", "processing", "delivered", "cancelled"], default: "placed" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
