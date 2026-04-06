import { db } from "../config/db.js";
import { validateUser, getFoods } from "../utils/api.js";

export const createOrderService = async ({ userId, items, paymentMethod }) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1. validate user
    await validateUser(userId);

    // 2. get foods
    const foodIds = items.map(i => i.foodId);
    const foods = await getFoods(foodIds);

    const foodMap = {};
    foods.forEach(f => (foodMap[f.id] = f));

    // 3. calculate total
    let total = 0;

    for (const item of items) {
      const food = foodMap[item.foodId];
      if (!food) throw new Error("Food not found");

      total += food.price * item.quantity;
    }

    // 4. insert order (FIX snake_case)
    const [result] = await conn.execute(
      `INSERT INTO orders (user_id, total_price, status, method)
       VALUES (?, ?, ?, ?)`,
      [userId, total, "PENDING", paymentMethod]
    );

    const orderId = result.insertId;

    // 5. insert items (FIX snake_case)
    for (const item of items) {
      const price = foodMap[item.foodId].price;

      await conn.execute(
        `INSERT INTO order_items (order_id, food_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.foodId, item.quantity, price]
      );
    }

    await conn.commit();

    return {
      orderId,
      totalPrice: total
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getOrdersService = async (userId) => {

  let query = `
    SELECT 
      id,
      user_id AS userId,
      total_price AS totalPrice,
      status,
      method AS paymentMethod,
      created_at AS createdAt
    FROM orders
  `;

  let params = [];

  if (userId) {
    query += ` WHERE user_id = ?`;
    params.push(userId);
  }

  const [orders] = await db.execute(query, params);

  // lấy items
  for (const order of orders) {
    const [items] = await db.execute(
      `SELECT 
         id,
         order_id AS orderId,
         food_id AS foodId,
         quantity,
         price
       FROM order_items WHERE order_id = ?`,
      [order.id]
    );

    order.items = items;
  }

  return orders;
};
