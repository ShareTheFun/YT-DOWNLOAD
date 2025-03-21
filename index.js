const express = require("express");
const path = require("path");
const { getDownloadDetails } = require("youtube-downloader-cc-api");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Route to serve the documentation page
app.get("/doc", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Download API endpoint
app.get("/download", async (req, res) => {
    try {
        const url = req.query.url;
        const type = req.query.type || "mp3";

        if (!url) {
            return res.status(400).json({ error: "Missing 'url' parameter" });
        }

        const responseType = "stream";
        const response = await getDownloadDetails(url, type, responseType);

        if (!response || !response.download || !response.title) {
            return res.status(500).json({ error: "Failed to retrieve download details" });
        }

        res.json({
            download: response.download,
            title: response.title,
            package_by: "Jonell Magallanes",
            project_web_by: "Jmlabaco"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Custom 404 Route - Redirects to public/404.html
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
