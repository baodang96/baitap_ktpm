import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  //host: "172.16.52.198:3307",
  host: "localhost",
  user: "root",
  password: "sapassword",
  database: "mini_food_order_system",
  waitForConnections: true,
  connectionLimit: 10
});