// app.js включает основную логику сервера, запуск и подключение к базе данных;
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

/** 1 */
const { PORT = 3000 } = process.env;
const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

/** подключаемся к серверу mongo */
// mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
// mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
//   // useNewUrlParser: true,
//   // useCreateIndex: true,
//   // useFindAndModify: false,
// });
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

/** 2 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// parse application/json
app.use(bodyParser.json());

/** 3 routes */
app.use('/users', usersRouter); // запросы в корень будем матчить с путями которые прописали в руте юзеров
app.use('/cards', cardsRouter);

// временное решение авторизации. мидлвэр
app.use((req, res, next) => {
  req.user = { // Она добавляет в каждый запрос объект user.
    // Берите из него идентификатор пользователя в контроллере создания карточки.
    _id: '641759709a112c44444a1355'// вставьте _id созданного в предыдущем пункте пользователя
  };

  next();
});

/** 4 */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
