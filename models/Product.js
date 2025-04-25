const db = require("../config/db");

class Product {
    // Create a new product
    static async createProduct(name, description, price, category_id, image) {
        const [rows] = await db.query(
            'INSERT INTO products (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, category_id, image]
        );
        return rows;
    }

    // Get all products
    static async getAllProducts() {
        const [rows] = await db.query(
            'SELECT products.*, categories.name AS category_name FROM products JOIN categories ON products.category_id = categories.id'
        );
        return rows;
    }

    // Get a single product by ID
    static async getProductById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    // Update a product by ID
    static async updateProduct(id, name, description, price, category_id, image) {
        const [rows] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image = ? WHERE id = ?',
            [name, description, price, category_id, image, id]
        );
        return rows;
    }

    // Delete a product by ID
    static async deleteProduct(id) {
        const [rows] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return rows;
    }
}

module.exports = Product;
