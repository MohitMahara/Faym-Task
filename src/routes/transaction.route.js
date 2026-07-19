import express from "express";
import transactionController from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/:userId", transactionController.getUserTransactions);

export default router;