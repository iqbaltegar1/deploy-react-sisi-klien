import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Rewrite URL to map /api/* to /* so json-server matches the endpoints directly from db.json
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
}));

server.use(router);

export default server;
