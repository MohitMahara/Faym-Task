import express from  "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { handleError } from "./src/middlewares/error.middleware.js";
import dns from "dns";
import authRoutes from "./src/routes/auth.route.js";
import saleRoutes from "./src/routes/sale.route.js";
import transactionRoutes from "./src/routes/transaction.route.js";
import withdrawalRoutes from "./src/routes/withdrawal.route.js";
import "./src/cron/payout.processor.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Due to local installed node.js  dns issue
dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/sale", saleRoutes);
app.use("/api/v1/transaction", transactionRoutes);
app.use("/api/v1/withdrawal", withdrawalRoutes);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});