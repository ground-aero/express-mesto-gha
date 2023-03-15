const express = require('express');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

const animals = {
  dog: {
    type1: 'chihuahua',
    type2: 'bloodhound',
    type3: 'german shepherd',
  },
  cat: {
    type1: 'abyssinian',
    type2: 'dwelf',
    type3: 'highlander',
  },
};

app.get('/animals', (req, res) => { // отдать объект клиенту, если тот запросит страницу по адресу /animals
// res.send(animals)
  res.send(animals[req.query.animal][req.query.type]); // реализован поиск
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(BASE_PATH);
});
