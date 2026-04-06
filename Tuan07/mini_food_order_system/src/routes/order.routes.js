import express from "express";
import { createOrder, getOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getOrders);

export default router;