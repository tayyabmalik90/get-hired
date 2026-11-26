"use strict";

const http = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

const publicFiles = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/script.js", ["script.js", "text/javascript; charset=utf-8"]],
]);
const port = Number(process.env.PORT || 4173);

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }

  const asset = publicFiles.get(pathname);
  if (!asset) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  try {
    const body = await readFile(path.join(__dirname, asset[0]));
    res.writeHead(200, {
      "Content-Type": asset[1],
      "Content-Length": body.length,
      "Cache-Control": "no-store",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(500);
    res.end("Unable to read the requested asset.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`ResumePolish is available at http://localhost:${port}`);
});
