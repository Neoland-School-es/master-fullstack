// /server/server.express.js
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { crud } from "./server.crud.js";

const app = express();
const port = process.env.PORT;
const ARTICLES_URL = './server/BBDD/articles.json'
const USERS_URL = './server/BBDD/users.json'
const DEFAULT_SESSION = { resave: false, saveUninitialized: false, secret: process.env.SESSION_SECRET, cookie: { maxAge: 60000 }}

// Static server
app.use(express.static('practica', { setHeaders }));
// for parsing application/json
app.use(bodyParser.json())
// for parsing client-side cookies
app.use(cookieParser())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// for session storage
app.use(session(DEFAULT_SESSION))

// 1. Articles
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
// 2. Users
// CREATE
app.post('/create/users', requireAuth, (req, res) => {
  crud.create(USERS_URL, req.body, (data) => {
    console.log(`server create user ${data.name} creado`, data)
    res.json(data)
  });
})
// READ
app.get('/read/users', (req, res) => {
  crud.read(USERS_URL, (data) => {
    console.log('server read users', data)
    res.json(data)
  });
})
// LOGIN
app.post('/login', (req, res) => {
  // Simulamos un login
  if (!req.body.username || !req.body.password) {
    res.status(401).send('Unauthorized')
  } else {
    // Buscamos en la BBDD el usuario con ese username
    crud.findByUsername(USERS_URL, req.body.username, (data) => {
      if (data) {
        if (data.password === req.body.password) {
          const USER_TOKEN = '123456'
          // Almacenamos en la sesión el token del inicio de sesión del usuario
          req.session.user = {
            ...data,
            token: USER_TOKEN
          }
          console.log('user logged in', req.session.user.token)
          res.json({ token: USER_TOKEN })
        } else {
          res.status(401).send('Unauthorized: wrong username or password')
        }
      }
    })
  }
})
// LOGOUT
app.get('/logout/:id', requireAuth, (req, res) => {
  console.log('server logout user')
  req.session.destroy(() => {
    res.json({ message: `user ${req.params.id} logout ok` })
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
    domain: '127.0.0.1',
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