const db = require("../config/db");

class Cart {
    static async createCart(user_id) {
        const [rows] = await db.query(
            "INSERT INTO carts (user_id) VALUES (?)",
            [user_id]
        );
        return rows.insertId;
    }

    static async getLatestCartByUserId(user_id) {
        const [rows] = await db.query("SELECT * FROM carts WHERE user_id = ? ORDER BY id DESC LIMIT 1", [user_id]);
        return rows.length ? rows[0] : null;  // ✅ Return the first object or null if no cart exists
    }

    static async getCartByUserId(user_id) {
        const [rows] = await db.query("SELECT * FROM carts WHERE user_id = ?", [
            user_id,
        ]);
        return rows[0];
    }
    


    static async deleteCartByUserId(user_id) {
        const [rows] = await db.query("DELETE FROM carts WHERE user_id = ?", [
            user_id,
        ]);
        return rows;
    }

    static async updateTotalAmount(user_id, total_amount) {
        const [rows] = await db.query(
            "UPDATE carts SET total_amount = ? WHERE user_id = ?",
            [total_amount, user_id]
        );
        return rows;
    }

}

module.exports = Cart;
