const db = require("../config/db");

class CartItem {
    static async createCartItem(cart_id, product_id, quantity, price) {
        const [rows] = await db.query(
            "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
            [cart_id, product_id, quantity, price] // Ensure this array has exactly 4 values
        );
        return rows;
    }
    
    static async getCartItemsByCartId(cart_id) {
        const [rows] = await db.query(
            "SELECT * FROM cart_items WHERE cart_id = ?",
            [cart_id]
        );
        return rows;
    }

    static async getByCartIdAndProductId(cart_id, product_id) {
        console.log("cart_id and product_id:", cart_id, product_id);
        const [rows] = await db.query(
            "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
            [cart_id, product_id]
        );
        return rows[0];
    }

    static async deleteCartItemByCartIdAndProductId(cart_id, product_id) {
        const [rows] = await db.query(
            "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
            [cart_id, product_id]
        );
        return rows;
    }

    static async updateQuantityByCartIdAndProductId(cart_id, product_id, quantity) {
        const [rows] = await db.query(
            "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
            [quantity, cart_id, product_id]
        );
        return rows;
    }

    static async getTotalAmount(cart_id) {
        const [rows] = await db.query(
            "SELECT SUM(price) AS total_amount FROM cart_items WHERE cart_id = ?",
            [cart_id]
        );
        return rows[0].total_amount;
    }
}

module.exports = CartItem;
