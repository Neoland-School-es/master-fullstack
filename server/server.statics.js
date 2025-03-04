// /server/server.statics.js
import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./practica");

/**
 * Prepara un archivo para ser leído por el servidor.
 * - Si termina en /, se asume que es una carpeta y se busca
 *   el archivo index.html en esa carpeta.
 * - Se comprueba que el archivo exista y no sea un path traversal.
 * - Si el archivo no se encuentra, se devuelve el archivo 404.html.
 * - Se devuelve un objeto con:
 *   - found: booleano indicando si se encontr  el archivo.
 *   - ext: la extensi n del archivo (sin el punto).
 *   - stream: un stream que se puede utilizar para leer el archivo.
 * @param {string} url - La URL del archivo que se quiere leer.
 * @returns {Promise<{found: boolean, ext: string, stream: fs.ReadStream}>}.
 */
const prepareFile = async (url) => {
  const paths = [STATIC_PATH, url];
  if (url.endsWith("/")) paths.push("index.html");
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(() => true, () => false);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : STATIC_PATH + "/404.html";
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { found, ext, stream };
};

http.createServer(async (request, response) => {
  const file = await prepareFile(request.url);
  const statusCode = file.found ? 200 : 404;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
  response.writeHead(statusCode, { "Content-Type": mimeType });
  file.stream.pipe(response);
  console.log(`${request.method} ${request.url} ${statusCode}`);
})
.listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');
