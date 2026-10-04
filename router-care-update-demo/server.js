const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const DB_FILE = path.join(DATA_DIR, "comments.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]", "utf8");

function readComments() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveComment(text) {
  const comments = readComments();
  comments.push({
    id: crypto.randomUUID(),
    comment: text,
    createdAt: new Date().toISOString()
  });
  fs.writeFileSync(DB_FILE, JSON.stringify(comments, null, 2), "utf8");
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  })[ext] || "application/octet-stream";
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/api/comments") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 20000) req.destroy();
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const text = typeof parsed.comment === "string" ? parsed.comment.trim() : "";

        if (!text) return sendJson(res, 400, { error: "Comment is required." });
        if (text.length > 1000) return sendJson(res, 400, { error: "Comment is too long." });

        saveComment(text);
        return sendJson(res, 201, { ok: true });
      } catch {
        return sendJson(res, 400, { error: "Invalid request." });
      }
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET") {
    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const safePath = path.normalize(path.join(PUBLIC, requested));

    if (!safePath.startsWith(PUBLIC)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    fs.readFile(safePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not found");
      }
      res.writeHead(200, { "Content-Type": contentType(safePath) });
      res.end(data);
    });
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Router Care demo running at http://localhost:${PORT}`);
});
