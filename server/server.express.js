// /server/server.express.js
import express from 'express';

const app = express();
const port = process.env.PORT;

// Static server
app.use(express.static('practica'));
// CREATE
app.post('/create/articles', requireAuth, (req, res) => {
  res.send('Article created!')
})
// READ
app.get('/read/articles', (req, res) => {
  res.send('Articles\' list')
})
// UPDATE
app.put('/update/articles/:id', requireAuth, (req, res) => {
  res.send(`Article ${req.params.id} updated!`)
})
// DELETE
app.delete('/delete/articles/:id', requireAuth, (req, res) => {
  res.send(`Article ${req.params.id} deleted!`)
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