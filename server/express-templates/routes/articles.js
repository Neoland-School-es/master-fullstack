var express = require('express');
var router = express.Router();
// La ruta de las importaciones depende de la ubicación del archivo actual
var crud = require('../../server.crud.js')?.crud;
// La ruta para encontrar el archivo depende de la carpeta de ejecución del server
const ARTICLES_URL = '../BBDD/articles.json'

/* GET users listing. */
router.get('/', function(req, res, next) {
  crud.read(ARTICLES_URL, (data) => {
    console.log('server read articles', data)
    // res.json(data)
    res.render('articles', { title: 'Lista de articulos', articles: data });
  });
});

module.exports = router;
