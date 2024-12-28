const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");



const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
//render the home page
app.get('/', (req, res) => {
  res.render('index', { articleContent:""});
});

// Import route handler
const getArticle = require("./routes/get-article");
const downloadArticle=require("./routes/download-article")

// Route
app.get("/getArticle", getArticle);
app.post("/downloadArticle", downloadArticle);
// Start server
app.listen(port, () => {
  console.log(`Medium article app listening at http://localhost:${port}`);
});
