import express from "express";
import withdrawalController from "../controllers/withdrawal.controller.js";

const router = express.Router();

router.post("/", withdrawalController.createWithdrawal);

router.patch("/:withdrawalId/status", withdrawalController.updateWithdrawalStatus);

export default router;