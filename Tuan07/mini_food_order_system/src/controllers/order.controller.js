import { createOrderService, getOrdersService } from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const result = await createOrderService(req.body);

    res.json({
      message: "order_created",
      data: result
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const orders = await getOrdersService(userId);

    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};