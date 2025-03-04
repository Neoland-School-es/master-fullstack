// /server/server.express.js
import express from 'express';
import bodyParser from 'body-parser';
import { crud } from "./server.crud.js";

const app = express();
const port = process.env.PORT;
const ARTICLES_URL = './server/BBDD/articles.json'

// Static server
app.use(express.static('practica'));
// for parsing application/json
app.use(bodyParser.json())
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