const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const submissions = [];

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
};

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  // API: submit contact
  if (req.method === "POST" && req.url === "/api/contact") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const { name, email, company, message } = data;

        if (!name || !email || !message) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Missing required fields." }));
        }

        const entry = {
          id: submissions.length + 1,
          name,
          email,
          company: company || "—",
          message,
          receivedAt: new Date().toISOString(),
        };
        submissions.push(entry);

        console.log(`[Contact] New submission from ${name} <${email}>`);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Submission received." }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON." }));
      }
    });
    return;
  }

  // API: view submissions (admin)
  if (req.method === "GET" && req.url === "/api/submissions") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(submissions));
  }

  // Static files
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});