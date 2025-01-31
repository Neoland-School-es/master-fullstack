# MongoDB

* ¿Qué es el NoSQL?
* Modelo de datos en MongoDB
* Modelo de query en MongoDB
* Indexado de datos
* Bases de datos y colecciones
* Operaciones con los datos

## Conexión con MongoDB

```js
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/animals", (err, client) => {
  if (err) throw err;

  const db = client.db("animals");
  db.collection("mammals")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      console.log(result);
      client.close();
    });
});
```

## Certificación oficial

[Programa GitHub Studen Developer Program con MongoDB](https://www.mongodb.com/students?utm_source=LINKEDIN&utm_medium=ORGANIC_SOCIAL_ADVOCACY).
