import express from "express";
import saleController from "../controllers/sale.controller.js";

const router = express.Router();

router.post("/", saleController.createSale);

router.patch("/:saleId/status", saleController.updateSaleStatus);

export default router;