import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

import User from "./models/User.js";
import Order from "./models/Order.js";
import Coupon from "./models/Coupon.js";
import Product from "./models/Product.js";
import { requireAuth } from "./middleware/requireAuth.js";

// -------------------- APP INIT --------------------
const app = express();
app.use(express.json());
app.use(cookieParser());

// Allow frontend origins to access the backend
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://orderquickcart.netlify.app",
      "https://speedmart-order.netlify.app",
      "http://127.0.0.1:5500",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// -------------------- STATIC FILES (if needed locally) --------------------
app.use(express.static("../frontend"));

// -------------------- DB CONNECT --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB Connected to ${process.env.MONGO_URI}`))
  .catch(err => console.log("❌ MongoDB Error:", err));

// -------------------- ADMIN AUTH MIDDLEWARE --------------------
function requireAdmin(req, res, next) {
  const adminKey = req.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ ok: false, msg: "Forbidden: invalid admin key" });
  }
  next();
}

// -------------------- AUTH ROUTES --------------------
app.post("/api/register", async (req, res) => {
  const { email, phone, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ ok: false, msg: "Email already used" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, phone, passwordHash: hash });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true });
  res.json({ ok: true });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ ok: false });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.json({ ok: false });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true });
  res.json({ ok: true });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ ok: true });
});

app.get("/api/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("email phone");
  res.json({ ok: true, email: user.email, phone: user.phone });
});

app.post("/api/user/update", requireAuth, async (req, res) => {
  try {
    const { phone, password } = req.body;
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("email phone");
    if (!user) return res.json({ ok: false, msg: "User not found" });
    res.json({ ok: true, email: user.email, phone: user.phone });
  } catch (error) {
    console.error("Update profile error:", error);
    res.json({ ok: false, msg: "Server error" });
  }
});

// -------------------- COUPONS --------------------
app.post("/api/admin/coupons", async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json({ ok: true, coupon });
  } catch (error) {
    res.json({ ok: false, msg: error.message });
  }
});

// app.post("/api/coupon/validate", requireAuth, async (req, res) => {
//   const { code } = req.body;
//   if (!code) return res.json({ ok: false, msg: "No code provided" });

//   const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
//   if (!coupon) return res.json({ ok: false, msg: "Invalid or inactive coupon" });

//   if (new Date() > new Date(coupon.validUpto)) {
//     return res.json({ ok: false, msg: "Coupon expired" });
//   }

//   if (coupon.isFirstOrderOnly) {
//     const orderCount = await Order.countDocuments({ userId: req.user.id });
//     if (orderCount > 0) {
//       return res.json({ ok: false, msg: "Valid for first order only" });
//     }
//   }

//   if (coupon.maxUsesPerUser > 0) {
//     const usage = coupon.usedBy.find(u => u.userId.toString() === req.user.id);
//     if (usage && usage.count >= coupon.maxUsesPerUser) {
//       return res.json({ ok: false, msg: "Usage limit reached for this coupon" });
//     }
//   }

//   res.json({ ok: true, discount: coupon.discount });
// });

app.post("/api/coupon/validate", requireAuth, async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code) {
    return res.json({ ok: false, msg: "No code provided" });
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true
  });

  if (!coupon) {
    return res.json({ ok: false, msg: "Invalid or inactive coupon" });
  }

  if (new Date() > new Date(coupon.validUpto)) {
    return res.json({ ok: false, msg: "Coupon expired" });
  }

  // ✅ Minimum Order Value Check
  if ((Number(subtotal) || 0) < coupon.minOrderVal) {
    return res.json({
      ok: false,
      msg: `Minimum order value is ₹${coupon.minOrderVal}`
    });
  }

  if (coupon.isFirstOrderOnly) {
    const orderCount = await Order.countDocuments({
      userId: req.user.id
    });

    if (orderCount > 0) {
      return res.json({
        ok: false,
        msg: "Valid for first order only"
      });
    }
  }

  if (coupon.maxUsesPerUser > 0) {
    const usage = coupon.usedBy.find(
      u => u.userId.toString() === req.user.id
    );

    if (usage && usage.count >= coupon.maxUsesPerUser) {
      return res.json({
        ok: false,
        msg: "Usage limit reached for this coupon"
      });
    }
  }

  // Calculate Discount
  let discountAmount = (Number(subtotal) * coupon.discount) / 100;

  // Apply max discount
  if (coupon.maxDiscount > 0) {
    discountAmount = Math.min(discountAmount, coupon.maxDiscount);
  }

  res.json({
    ok: true,
    discount: Number(discountAmount.toFixed(2)),
    discountPercent: coupon.discount
  });
});

// GET /api/coupon/recommendations?subtotal=<n>
// Returns all active coupons with eligibility info for the authenticated user
app.get("/api/coupon/recommendations", requireAuth, async (req, res) => {
  try {
    const subtotal = Number(req.query.subtotal) || 0;
    const now = new Date();

    // Fetch all active, non-expired coupons
    const coupons = await Coupon.find({ isActive: true, validUpto: { $gt: now } }).lean();

    // Order count for firstOrderOnly check
    const orderCount = await Order.countDocuments({ userId: req.user.id });

    const recommendations = coupons.map((coupon) => {
      let eligible = true;
      let reason = null;

      // First-order restriction
      if (coupon.isFirstOrderOnly && orderCount > 0) {
        eligible = false;
        reason = "Valid for first order only";
      }

      // Usage limit
      if (eligible && coupon.maxUsesPerUser > 0) {
        const usage = coupon.usedBy.find(
          (u) => u.userId.toString() === req.user.id
        );
        if (usage && usage.count >= coupon.maxUsesPerUser) {
          eligible = false;
          reason = "You've reached the usage limit";
        }
      }

      // Min order value
      const meetsMinOrder = subtotal >= coupon.minOrderVal;
      const shortfall = meetsMinOrder ? 0 : Number((coupon.minOrderVal - subtotal).toFixed(2));

      // Calculate potential saving (even if min order not yet met, show what they'd save)
      const rawDiscount = (subtotal * coupon.discount) / 100;
      const saving = Number(
        Math.min(rawDiscount, coupon.maxDiscount > 0 ? coupon.maxDiscount : rawDiscount).toFixed(2)
      );

      return {
        code: coupon.code,
        discount: coupon.discount,
        maxDiscount: coupon.maxDiscount,
        minOrderVal: coupon.minOrderVal,
        isFirstOrderOnly: coupon.isFirstOrderOnly,
        eligible,
        reason,
        meetsMinOrder,
        shortfall,
        saving: meetsMinOrder ? saving : 0,
        potentialSaving: saving, // what they'd save if they met minOrderVal
      };
    });

    // Sort: eligible & meets min first → eligible but low cart → ineligible
    recommendations.sort((a, b) => {
      const scoreA = (a.eligible ? 2 : 0) + (a.meetsMinOrder ? 1 : 0);
      const scoreB = (b.eligible ? 2 : 0) + (b.meetsMinOrder ? 1 : 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return b.saving - a.saving; // higher saving first
    });

    res.json({ ok: true, recommendations });
  } catch (err) {
    console.error("recommendations error:", err);
    res.json({ ok: false, msg: "Failed to fetch recommendations" });
  }
});

// -------------------- PRODUCT / INVENTORY ROUTES --------------------

// Public: get all products with current stock
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}, { _id: 0, __v: 0 }).lean();
    res.json({ ok: true, products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    res.json({ ok: false, msg: "Failed to fetch products" });
  }
});

// Admin: get all products (same as public for now, reserved for future expansion)
app.get("/api/admin/products", requireAdmin, async (req, res) => {
  try {
    const products = await Product.find({}).lean();
    res.json({ ok: true, products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    res.json({ ok: false, msg: "Failed to fetch products" });
  }
});

// Admin: add a new product
app.post("/api/admin/products", requireAdmin, async (req, res) => {
  try {
    const { name, price, category, subcategory, stock, image } = req.body;

    if (!name || !price || !category) {
      return res.json({ ok: false, msg: "Name, price and category are required" });
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.json({ ok: false, msg: "Price must be a positive number" });
    }

    const stockNum = Number(stock) || 0;

    // Generate a unique id from name + timestamp suffix
    const baseId = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    const suffix = Date.now().toString(36);
    const id = `${baseId}_${suffix}`;

    const product = await Product.create({
      id,
      name: name.trim(),
      price: priceNum,
      category: category.trim(),
      subcategory: (subcategory || '').trim(),
      stock: stockNum,
      image: image || '',
    });

    res.json({ ok: true, product });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    res.json({ ok: false, msg: error.message || "Failed to add product" });
  }
});

// Admin: update a product's stock (and optionally price)
app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    const { stock, price } = req.body;
    const updateData = {};

    if (stock !== undefined) {
      const stockNum = Number(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.json({ ok: false, msg: "Stock must be a non-negative number" });
      }
      updateData.stock = stockNum;
    }

    if (price !== undefined) {
      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return res.json({ ok: false, msg: "Price must be a positive number" });
      }
      updateData.price = priceNum;
    }

    if (Object.keys(updateData).length === 0) {
      return res.json({ ok: false, msg: "No valid fields to update" });
    }

    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true }
    );

    if (!product) return res.json({ ok: false, msg: "Product not found" });

    res.json({ ok: true, product });
  } catch (error) {
    console.error("PUT /api/admin/products error:", error);
    res.json({ ok: false, msg: "Failed to update product" });
  }
});
// Admin: delete a product
app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) return res.json({ ok: false, msg: "Product not found" });
    res.json({ ok: true, msg: "Product removed successfully" });
  } catch (error) {
    console.error("DELETE /api/admin/products error:", error);
    res.json({ ok: false, msg: "Failed to remove product" });
  }
});




// -------------------- ORDERS --------------------
app.get("/api/orders", requireAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ ok: true, orders });
});

app.post("/api/checkout", requireAuth, async (req, res) => {
  const { items, subtotal, total, paymentMethod, upiId, couponCode, couponDiscount, address } = req.body;

  if (!items || items.length === 0) {
    return res.json({ ok: false, msg: "Cart is empty" });
  }

  if (!address || !address.name || !address.line1 || !address.city || !address.state || !address.pincode) {
    return res.json({ ok: false, msg: "Shipping address is required" });
  }

  // -------------------- STOCK VALIDATION --------------------
  // Fetch all relevant products in one query
  const productIds = items.map(item => item.id).filter(Boolean);
  const dbProducts = await Product.find({ id: { $in: productIds } }).lean();
  const stockMap = {};
  for (const p of dbProducts) {
    stockMap[p.id] = p.stock;
  }

  for (const item of items) {
    if (!item.id) continue; // legacy items without id (e.g. buy-now before full migration)
    const availableStock = stockMap[item.id];
    if (availableStock === undefined) continue; // product not in DB yet — skip
    if (availableStock === 0) {
      return res.json({ ok: false, msg: `"${item.name}" is out of stock` });
    }
    if (item.qty > availableStock) {
      return res.json({ ok: false, msg: `Only ${availableStock} unit(s) of "${item.name}" are available` });
    }
  }

  // -------------------- COUPON VALIDATION --------------------
  const orderSubtotal = Number(subtotal) || items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);
  const normalizedCoupon = couponCode ? String(couponCode).trim().toUpperCase() : '';
  let expectedDiscount = 0;
  let activeCoupon = null;

  if (normalizedCoupon) {
    activeCoupon = await Coupon.findOne({ code: normalizedCoupon, isActive: true });
    if (!activeCoupon) {
      return res.json({ ok: false, msg: "Invalid coupon code" });
    }
    if (new Date() > new Date(activeCoupon.validUpto)) {
      return res.json({ ok: false, msg: "Coupon expired" });
    }
    if (activeCoupon.isFirstOrderOnly) {
      const orderCount = await Order.countDocuments({ userId: req.user.id });
      if (orderCount > 0) {
        return res.json({ ok: false, msg: "Valid for first order only" });
      }
    }
    if (activeCoupon.maxUsesPerUser > 0) {
      const usage = activeCoupon.usedBy.find(u => u.userId.toString() === req.user.id);
      if (usage && usage.count >= activeCoupon.maxUsesPerUser) {
        return res.json({ ok: false, msg: "Usage limit reached for this coupon" });
      }
    }
    // expectedDiscount = activeCoupon.discount;
    // Minimum order value
    if (orderSubtotal < activeCoupon.minOrderVal) {
      return res.json({
        ok: false,
        msg: `Minimum order value is ₹${activeCoupon.minOrderVal}`
      });
    }

    // Calculate actual discount
    expectedDiscount =
      (orderSubtotal * activeCoupon.discount) / 100;

    // Cap at maxDiscount
    if (activeCoupon.maxDiscount > 0) {
      expectedDiscount = Math.min(
        expectedDiscount,
        activeCoupon.maxDiscount
      );
    }

    // Round to avoid decimal mismatch
    expectedDiscount = Number(expectedDiscount.toFixed(2));
  }

  if (Number(couponDiscount || 0) !== expectedDiscount) {
    return res.json({ ok: false, msg: "Coupon discount mismatch" });
  }


  // -------------------- DELIVERY FEE --------------------
  function calculateDeliveryFee(subtotal) {
    if (subtotal >= 200) {
      return 0;
    } else if (subtotal >= 100) {
      return 20;
    } else {
      return 40;
    }
  }
  const discountValue = expectedDiscount;

  const discountAmount = Math.round(
    (orderSubtotal * discountValue) / 100
  );

  const deliveryFee = calculateDeliveryFee(orderSubtotal);

  const orderTotal = Math.max(
    0,
    orderSubtotal - discountAmount + deliveryFee
  );

  const order = await Order.create({
    userId: req.user.id,
    items,
    subtotal: orderSubtotal,
    deliveryFee,
    total: orderTotal,
    couponCode: normalizedCoupon,
    couponDiscount: discountValue,
    paymentMethod: paymentMethod === "upi" ? "upi" : "cod",
    upiId: paymentMethod === "upi" ? (upiId || "") : "",
    address,
  });

  if (activeCoupon) {
    const usageIndex = activeCoupon.usedBy.findIndex(u => u.userId.toString() === req.user.id);
    if (usageIndex > -1) {
      activeCoupon.usedBy[usageIndex].count += 1;
    } else {
      activeCoupon.usedBy.push({ userId: req.user.id, count: 1 });
    }
    await activeCoupon.save();
  }

  // -------------------- STOCK DEDUCTION --------------------
  // Decrement stock for each item that exists in the product DB
  for (const item of items) {
    if (!item.id || stockMap[item.id] === undefined) continue;
    await Product.findOneAndUpdate(
      { id: item.id, stock: { $gte: item.qty } }, // safety guard
      { $inc: { stock: -item.qty } }
    );
  }

  res.json({ ok: true, order });
});


// -------------------- START SERVER --------------------
app.listen(process.env.PORT || 8080, () =>
  console.log("✅ Backend Running on Port", process.env.PORT || 8080)
);
