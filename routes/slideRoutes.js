const express = require('express');
const router = express.Router();
const Slide = require("../models/Slide");
const authAdmin = require("../middleware/authAdmin");
const authenticate = require("../middleware/authenticate");
const upload = require('../middleware/upload');

// List all slides
router.get("/", authenticate, authAdmin, async (req, res) => {
    try {
        const slides = await Slide.getAllSlides();
        res.render("admin/slides/list", { slides, title: "Manage Slides", user: req.user });
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

// Create new slide
router.post("/", authenticate, authAdmin, async (req, res) => {
    try {
        const { title, description, link, is_active, display_order } = req.body;
        const image = '/uploads/' + req.file.filename;
        
        await db.query(
            'INSERT INTO slides (title, description, image, link, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, image, link, is_active === 'on', display_order]
        );
        
        res.redirect("/admin/slides");
    } catch(err) {
        console.log(err);
        res.status(500).send("Error creating slide");
    }
});

// Edit slide
router.get("/:id/edit", authenticate, authAdmin, async (req, res) => {
    try {
        const [slide] = await db.query('SELECT * FROM slides WHERE id = ?', [req.params.id]);
        res.render("admin/slides/edit", { slide: slide[0], title: "Edit Slide", user: req.user });
    } catch(err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

// Update slide
router.post("/:id/update", upload.single('image'), authenticate, authAdmin, async (req, res) => {
    try {
        const { title, description, link, is_active, display_order } = req.body;
        let image;
        
        if (req.file) {
            image = '/uploads/' + req.file.filename;
        } else {
            const [slide] = await db.query('SELECT image FROM slides WHERE id = ?', [req.params.id]);
            image = slide[0].image;
        }
        
        await db.query(
            'UPDATE slides SET title = ?, description = ?, image = ?, link = ?, is_active = ?, display_order = ? WHERE id = ?',
            [title, description, image, link, is_active === 'on', display_order, req.params.id]
        );
        
        res.redirect("/admin/slides");
    } catch(err) {
        console.log(err);
        res.status(500).send("Error updating slide");
    }
});

// Delete slide
router.post("/:id/delete", authenticate, authAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM slides WHERE id = ?', [req.params.id]);
        res.redirect("/admin/slides");
    } catch(err) {
        console.log(err);
        res.status(500).send("Error deleting slide");
    }
});

module.exports = router;