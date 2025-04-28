const db = require("../config/db");

class Slide {
    static async getAllSlides() {
        const [slides] = await db.query('SELECT * FROM slides WHERE is_active = 1 ORDER BY display_order');
        return slides;
    }
}

module.exports = Slide;