/**
 * Food Service — MariaDB food store
 */
const { generateId } = require('../shared/helpers');
const db = require('../shared/db');

const store = {
  async getAll() {
    const rows = await db.query('SELECT * FROM foods WHERE deleted = 0');
    return rows;
  },

  async getById(id) {
    const rows = await db.query('SELECT * FROM foods WHERE id = ? AND deleted = 0', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async create({ name, description, price, category, image }) {
    const food = {
      id: generateId('FOOD'),
      name,
      description: description || '',
      price: Number(price),
      category: category || 'Món chính',
      image: image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      available: true,
      deleted: false,
    };
    await db.query(
      'INSERT INTO foods (id, name, description, price, category, image, available, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [food.id, food.name, food.description, food.price, food.category, food.image, food.available, food.deleted]
    );
    return food;
  },

  async update(id, updates) {
    const food = await this.getById(id);
    if (!food) return null;
    
    const newPrice = updates.price !== undefined ? Number(updates.price) : food.price;
    const newName = updates.name !== undefined ? updates.name : food.name;
    const newDesc = updates.description !== undefined ? updates.description : food.description;
    const newCategory = updates.category !== undefined ? updates.category : food.category;
    const newImage = updates.image !== undefined ? updates.image : food.image;
    const newAvailable = updates.available !== undefined ? updates.available : food.available;

    await db.query(
      'UPDATE foods SET name = ?, description = ?, price = ?, category = ?, image = ?, available = ? WHERE id = ?',
      [newName, newDesc, newPrice, newCategory, newImage, newAvailable, id]
    );
    return await this.getById(id);
  },

  async delete(id) {
    const result = await db.query('UPDATE foods SET deleted = 1 WHERE id = ? AND deleted = 0', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = store;
