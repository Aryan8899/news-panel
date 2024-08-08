const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { User, News } = require("./models/News"); // Ensure the correct path and model names
const bcrypt = require("bcrypt");
const connectToDatabase = require("./config/connectToDatabase");
const imageRouter = require("./routes/imageRoutes");

// MongoDB connection
connectToDatabase();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Initialize Express app
const app = express();
const PORT = 9000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use("/uploads", express.static(uploadDir));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Default route
app.get("/", (req, res) => {
  res.send("Hello MEDIUM");
});

app.use("/api/images", imageRouter);

// Route to handle user signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    4;
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Sign-in attempt with email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user);

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);
    if (!isMatch) {
      console.log("Password does not match for user with email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Sign-in successful for user with email:", email);
    res.json({ message: "Sign-in successful", user: { email: user.email } });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Route to handle adding a news article
app.post("/add", upload.single("image"), async (req, res) => {
  const { title, content, date } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

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
app.get("/articles", async (req, res) => {
  try {
    const articles = await News.find(); // Fetch all articles from the database
    res.status(200).json(articles); // Send articles as JSON
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).send("Error fetching articles: " + error.message);
  }
});

// Route to delete a news article
app.delete("/articles/:id", async (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
