const db = require("../config/db");
class Category{
      static async getAllCategories() {
            const [rows] = await db.query('SELECT * FROM categories');
            return rows;
      }

      static async getCategoryById(id) {
            const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
            return rows[0];
      }

      static async createCategory(name) {
            const [rows] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
            return rows;
      }

      static async updateCategory(id, name) {
            const [rows] = await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
            return rows;
      }

      static async deleteCategory(id) {
            const [rows] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
            return rows;
      }
}

module.exports = Category