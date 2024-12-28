const express = require("express");
const downloadArticle = express.Router();

downloadArticle.post("/downloadArticle", (req, res) => {
  const { articleContent } = req.body;

  if (!articleContent) {
    return res.status(400).send("No article content available to download.");
  }

  // Set file name and content
  const fileName = "article.txt";
  const fileContent = articleContent.replace(/<br>/g, "\n"); // Replace <br> tags with newlines

  // Set response headers for file download
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-Type", "text/plain");

  // Send the file content
  res.send(fileContent);
});

module.exports = downloadArticle;
