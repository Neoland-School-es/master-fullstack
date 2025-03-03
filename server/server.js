// /server/server.js
import * as http from "node:http";
import * as url from "node:url";

http.createServer(function server_onRequest(request, response) {
  var pathname = url.parse(request.url).pathname;

  console.log("Request for " + pathname + " received.");

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  response.setHeader("Access-Control-Allow-Headers", "*");
  response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  response.writeHead(200, { 'Content-Type': 'text/html' });

  // Router:
  switch (pathname) {
    case "/":
      response.write(getPageLayout(getHomePage()));
      break;
    case "/form":
      response.write(getPageLayout(getFormPage()));
      break;
    default:
      response.write(getPageLayout(getNotFoundPage()));
      break;
  }

  response.end();
}).listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');

function getPageLayout(page) {
  return `
    <html>
      <head>
        <title>Servidor Node JS</title>
        <style>
          nav ul {
            display: flex;
            list-style-type: none;
            gap: 20px;
          }
        </style>
      </head>
      <body>
        ${page}
      </body>
    </html>
    `;
}

function getHomePage() {
  return `
    <h1>Bienvenido a la p&aacute;gina de inicio</h1>
    <nav>
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/form">Formulario</a></li>
      </ul>
    </nav>
    <section>
      <p>Tenemos un servidor de node activo!</p>
    </section>
    `;
}

function getFormPage() {
  return `
    <h1>Formulario</h1>
    <nav>
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/form">Formulario</a></li>
      </ul>
    </nav>
    <section>
      <form>
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" required>
        <button type="submit">Enviar</button>
      </form>
    </section>
    `;
}

function getNotFoundPage() {
  return `
    <h1>P&aacute;gina no encontrada</h1>
    <nav>
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/form">Formulario</a></li>
      </ul>
    </nav>
    <section>
      <p>La p&aacute;gina que buscas no existe (Error: 404).</p>
    </section>
    `;
}