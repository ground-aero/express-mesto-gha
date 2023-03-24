/** осн. логика сервера, запуск и подключение к БД */
const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {
  ERR_CODE_404,
} = require('./errors/errors-codes');

/** 1 */
const { PORT = 3000 } = process.env;
const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

/** 2 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** подключаемся к серверу mongo */
mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(morgan('dev'));

// временное решение авторизации. мидлвэр
app.use((req, res, next) => {
  req.user = { // Она добавляет в каждый запрос объект user.
    // Берите из него идентификатор пользователя в контроллере создания карточки.
    _id: '641759709a112c44444a1355', // вставьте _id созданного в предыдущем пункте пользователя
  };
  next();
});

/** 3 Routes which handling requests */
app.use('/users', usersRouter); // запросы в корень будем матчить с путями которые прописали в руте юзеров
app.use('/cards', cardsRouter);

/** error handler для роута неизвестного маршрута, должен отправить только ошибку с кодом 404 */
// app.all('*', (req, res, next) => {
//   res.status(ERR_CODE_404).send('сервер не может найти запрашиваемый маршрут/ресурс');
//   next();
// });

/** 4 */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
