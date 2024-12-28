const http = require("https");





function fetchArticle(articleId, res) {
  const options = {
    method: "GET",
    hostname: "medium2.p.rapidapi.com",
    path: `/article/${articleId}/content`,
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY, // Use key from .env for security
      "x-rapidapi-host": "medium2.p.rapidapi.com",
    },
  };

  const req = http.request(options, (response) => {
    const chunks = [];

    response.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.on("end", () => {
      const body = Buffer.concat(chunks);
      const articleContent = JSON.parse(body.toString()).content; // Assuming the API response has a 'content' field

      // Step 1: Split the content into paragraphs by two newlines (a common paragraph delimiter)
    const paragraphs = articleContent.split("\n\n");

      // Step 2: For each paragraph, convert newlines within that paragraph into <br> tags
      const formattedContent = paragraphs
        .map(paragraph => {
          // Step 2.1: Split paragraph into lines (by single newline) and then join with <br> tags
          const lines = paragraph.split("\n").join("<br>");
          
          // Step 2.2: Wrap the formatted paragraph with <p> tags
          return `${lines}`;
        })
        .join("\n\n"); // Step 3: Join all formatted paragraphs together with double newlines

      // Render EJS template with formatted article content
      res.render("index", { articleContent: formattedContent });
      
    });
  });

  req.on("error", (err) => {
    console.error("Error fetching article:", err);
    res.status(500).send("Error fetching article");
  });

  req.end();
}

// Function to extract the Medium article ID from the URL
function getMediumArticleID(url) {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter((segment) => segment);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const parts = lastSegment.split("-");
    const articleID = parts[parts.length - 1];

    if (/^[a-zA-Z0-9]+$/.test(articleID)) {
      return articleID;
    } else {
      throw new Error("Could not extract a valid article ID.");
    }
  } catch (error) {
    console.error("Invalid URL provided:", error);
    return null;
  }
}

// Route handler function
const getArticle = (req, res) => {
  const { url } = req.query; // Extract URL from query parameters

  if (!url) {
    return res.status(400).send("Please provide a Medium article URL.");
  }

  const articleId = getMediumArticleID(url);
  if (!articleId) {
    return res.status(400).send("Invalid Medium article URL.");
  }

  fetchArticle(articleId, res);
};

module.exports = getArticle;
