import fs from 'fs';

export async function findByUsername(file, username, callback) {
  let parsedData = []
  try {
    if (fs.existsSync(file)) {
      await fs.readFile(file, function (err, data) {
        parsedData = JSON.parse(data.toString());
        if (err) {
          console.log('findByUsername', err);
          return err;
        }
        const found = parsedData.find((item) => item.username === username);
        if (callback && !err) {
          return callback(found);
        }
      })
    } else {
      console.log('findByUsername', 'El fichero no existe');
      if (callback) {
        return callback('El fichero no existe');
      }
    }
  } catch (err) {
    console.log('findByUsername', `Error: ${err}`);
    return err;
  }
}