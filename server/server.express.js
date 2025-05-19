// /server/server.express.js
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { crud } from "./server.crud.js";

const app = express();
const port = process.env.PORT;
const ARTICLES_URL = './server/BBDD/articles.json'

// Static server
app.use(express.static('practica', { setHeaders }));
// for parsing application/json
app.use(bodyParser.json())
// for parsing client-side cookies
app.use(cookieParser())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// CREATE
app.post('/create/articles', requireAuth, (req, res) => {
  crud.create(ARTICLES_URL, req.body, (data) => {
    console.log(`server create article ${data.name} creado`, data)
    res.json(data)
  });
})
// READ
app.get('/read/articles', (req, res) => {
  console.log('read articles', req.cookies)
  crud.read(ARTICLES_URL, (data) => {
    console.log('server read articles', data)
    res.json(data)
  });
})
// UPDATE
app.put('/update/articles/:id', requireAuth, (req, res) => {
  crud.update(ARTICLES_URL, req.params.id, req.body, (data) => {
    console.log(`server update article ${req.params.id} modificado`, data)
  });
})
// DELETE
app.delete('/delete/articles/:id', requireAuth, (req, res) => {
  crud.delete(ARTICLES_URL, req.params.id, (data) => {
    console.log('server delete article', req.params.id, data)
    res.json(data)
  })
})

app.listen(port, async () => {
  console.log(`Shopping List listening on port ${port}`);
})

// Middlewares
function requireAuth(req, res, next) {
  // Simulation of authentication (OAuth2)
  if (req.headers.authorization === 'Bearer 123456') {
    next()
  } else {
    // Unauthorized
    res.status(401).send('Unauthorized')
  }
}

function setHeaders(res, path) {
  // "name" and "value"
  res.cookie('sessionId', '123456', {
    // "expires" - The cookie expires in 24 hours
    expires: new Date(Date.now() + 86400000),
    // "path" - The cookie is accessible for APIs under the '/api' route
    path: '/api',
    // "domain" - The cookie belongs to the 'example.com' domain
    domain: 'localhost',
    // "secure" - The cookie will be sent over HTTPS only
    secure: true,
    // "HttpOnly" - The cookie cannot be accessed by client-side scripts
    httpOnly: true
  });

  // We can also use "maxAge" to specify expiration time in milliseconds
  res.cookie('preferences', 'dark_theme', {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true // For security, also set "httpOnly" flag
  });
}