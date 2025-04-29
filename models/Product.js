const db = require("../config/db");

class Product {
    // Create a new product
    static async createProduct(name, description, price, category_id, image_path, image_public_id ) {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, category_id, image, image_public_id ) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, category_id, image_path, image_public_id]
        );
        // Return the inserted product's ID
        return result.insertId;  // This gives you the auto-incremented ID of the new product
    }    

    // Get all products
    static async getAllProducts() {
        const [products] = await db.query(`
            SELECT 
                products.*, 
                categories.name AS category_name
            FROM 
                products
            LEFT JOIN 
                categories ON products.category_id = categories.id
        `);
        return products;
    }

    static async getProductsByCategory(categoryId) {
        const [rows] = await db.query(
            'SELECT * FROM products WHERE category_id = ?',
            [categoryId]
        );
        return rows;
    }

    // Get a single product by ID
    static async getProductById(id) {
        const [rows] = await db.query(
            'SELECT products.*, categories.name AS category_name FROM products JOIN categories ON products.category_id = categories.id WHERE products.id = ?', 
            [id]
        );
        return rows[0];
    }
    

    // Update a product by ID
    static async updateProduct(id, name, description, price, category_id, image, image_public_id) {
        const [rows] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image = ? image_public_id = ? WHERE id = ?',
            [name, description, price, category_id, image, image_public_id, id]
        );
        return rows;
    }

    // Delete a product by ID
    static async deleteProduct(id) {
        const [rows] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return rows;
    }

    // Add these methods to your Product class

static async getFeaturedProducts(limit = 8) {
    const [products] = await db.query(`
        SELECT 
            products.*, 
            categories.name AS category_name
        FROM 
            products
        LEFT JOIN 
            categories ON products.category_id = categories.id
        WHERE 
            products.is_featured = 1
        LIMIT ?
    `, [limit]);
    return products;
}

static async getFilteredProducts(category, price, sort) {
    let query = `
        SELECT 
            p.*, 
            c.name AS category_name
        FROM 
            products p
        LEFT JOIN 
            categories c ON p.category_id = c.id
        WHERE 1=1
    `;
    const params = [];

    // Category filter
    if (category) {
        query += ' AND c.name = ?';
        params.push(category);
    }

    // Price range filter
    if (price) {
        if (price === '10000') {
            query += ' AND p.price > ?';
            params.push(10000);
        } else {
            const [min, max] = price.split('-').map(Number);
            query += ' AND p.price BETWEEN ? AND ?';
            params.push(min, max);
        }
    }

    // Sorting
    switch(sort) {
        case 'price_asc':
            query += ' ORDER BY p.price ASC';
            break;
        case 'price_desc':
            query += ' ORDER BY p.price DESC';
            break;
        case 'newest':
            query += ' ORDER BY p.created_at DESC';
            break;
        case 'popular':
            // Assuming you have a views column
            query += ' ORDER BY p.views DESC';
            break;
        default:
            query += ' ORDER BY p.created_at DESC';
    }

    const [products] = await db.query(query, params);
    return products;
}

static async getProductsForSlides() {
    const [products] = await db.query(`
        SELECT id, name, image 
        FROM products 
        ORDER BY created_at DESC
    `);
    return products;
}

static async addToSlides(productId, title, description, link, displayOrder = 0) {
    // First get the product details
    const [product] = await db.query(`
        SELECT name, image 
        FROM products 
        WHERE id = ?
    `, [productId]);
    
    if (!product[0]) {
        throw new Error('Product not found');
    }
    console.log(product[0]);
    console.log(product[0].image);

    // Insert into slides table
    const [result] = await db.query(`
        INSERT INTO slides (title, description, image, link, display_order, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
    `, [
        title || product[0].name, 
        description || `${product[0].name} - Now available!`,
        product[0].image,
        link || `/products/${productId}`,
        displayOrder
    ]);
    
    return result.insertId;
}
}

module.exports = Product;
