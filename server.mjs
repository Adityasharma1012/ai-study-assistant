import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import healthHandler from './api/health.js';
import askHandler from './api/ask.js';
import notesHandler from './api/notes.js';
import quizHandler from './api/quiz.js';
import studyPlanHandler from './api/study-plan.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.join(__dirname, '.env'));
loadEnvFile(path.join(__dirname, '.env.local'));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const apiRoutes = {
  '/api/health': healthHandler,
  '/api/ask': askHandler,
  '/api/notes': notesHandler,
  '/api/quiz': quizHandler,
  '/api/study-plan': studyPlanHandler,
};

function enhanceResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify(data));
    return res;
  };
  return res;
}

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
  });
  fs.createReadStream(filePath).pipe(res);
}

const PORT = Number(process.env.PORT || 3000);

const server = http.createServer(async (req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  const handler = apiRoutes[urlPath];

  if (handler) {
    try {
      await handler(req, enhanceResponse(res));
    } catch (err) {
      console.error(`API error on ${urlPath}:`, err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      }
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }

  if (urlPath.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: `Unknown API endpoint: ${urlPath}` }));
    return;
  }

  const requestedPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const resolvedPath = path.resolve(distDir, requestedPath);

  if (
    resolvedPath.startsWith(distDir) &&
    fs.existsSync(resolvedPath) &&
    fs.statSync(resolvedPath).isFile()
  ) {
    serveStaticFile(res, resolvedPath);
    return;
  }

  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    serveStaticFile(res, indexPath);
    return;
  }

  res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('dist/index.html not found. Run "npm.cmd run build" first.');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`StudyMind AI local server running at http://localhost:${PORT}`);
});
