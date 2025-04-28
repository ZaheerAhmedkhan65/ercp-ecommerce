const db = require("../config/db");

class ProductImage {
    // Create a new product
    static async create(product_id, image_path) {
        const [rows] = await db.query(
            'INSERT INTO product_images (product_id, image_path) VALUES (?, ?)',
            [product_id, '/uploads/' + image_path]  // Add the prefix here
        );
        return rows;
    }
}

module.exports = ProductImage;
