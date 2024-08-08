const express = require('express');
const router = express.Router();
const upload = require('../Middleware/multerStorage');
const { News } = require('../models/News');

// Route to handle adding a news article
router.post("/add", upload, async (req, res) => {
  const { title, content, date } = req.body;
  const image = req.file ? req.file.path : null;

  const newArticle = new News({ title, image, content, date });

  try {
    await newArticle.save();
    res.status(201).send("Article added successfully");
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).send("Error adding article: " + error.message);
  }
});

// Route to get all news articles
router.get("/articles", async (req, res) => {
  try {
    const articles = await News.find(); // Fetch all articles from the database
    res.status(200).json(articles); // Send articles as JSON
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).send("Error fetching articles: " + error.message);
  }
});

// Route to delete a news article
router.delete("/articles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await News.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send("Article not found");
    }

    res.status(200).send("Article deleted successfully");
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).send("Error deleting article: " + error.message);
  }
});

module.exports = router;
