import express from "express";
import orderRoutes from "./routes/order.routes.js";

const app = express();
app.use(express.json());

app.use(orderRoutes);

export default app;
