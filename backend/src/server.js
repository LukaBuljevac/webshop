require("dotenv").config();
const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const adminOrdersRoutes = require("./routes/adminOrders");
const adminLogsRoutes = require("./routes/adminLogs");


const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminOrdersRoutes);
app.use("/api/admin", adminLogsRoutes);



app.use((req, res) => res.status(404).json({ message: "Not found" }));

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

const wishlistRoutes = require("./routes/wishlist");
app.use("/api/wishlist", wishlistRoutes);
