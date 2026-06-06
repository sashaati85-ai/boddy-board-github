const http = require("http");
const fs = require("fs");
const path = require("path");

process.env.BODDY_STATE_STORE_FILE ||= path.join(__dirname, "data", "state.json");

const stateHandler = require("./api/state");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const STATIC_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent((request.url || "/").split("?")[0]);

    if (pathname === "/api/state") {
      await handleApiState(request, response);
      return;
    }

    serveStatic(pathname, response);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    response.end("Server error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Baddy server is running on http://${HOST}:${PORT}`);
});

async function handleApiState(request, response) {
  response.status = (code) => {
    response.statusCode = code;
    return response;
  };
  response.json = (payload) => {
    if (!response.headersSent) {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    response.end(JSON.stringify(payload));
  };

  if (request.method !== "GET" && request.method !== "OPTIONS") {
    request.body = await readJsonBody(request);
  }

  await stateHandler(request, response);
}

function serveStatic(pathname, response) {
  const filePath = getStaticFilePath(pathname);
  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": STATIC_TYPES[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(data);
  });
}

function getStaticFilePath(pathname) {
  const route = pathname === "/" || pathname === "/admin" || pathname === "/админ"
    ? "/index.html"
    : pathname;
  const filePath = path.join(ROOT, route);
  if (!filePath.startsWith(ROOT)) return "";
  return filePath;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error("Request body is too large"));
        request.destroy();
      }
    });

    request.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(raw);
      }
    });

    request.on("error", reject);
  });
}
