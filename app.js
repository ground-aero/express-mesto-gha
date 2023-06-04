/** осн. логика сервера, запуск и подключение к БД */
const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { errors } = require('celebrate');
const {
  ERR_CODE_404,
} = require('./errors/errors-codes');
const NotFoundErr = require('./errors/not-found-err');
/** 1 */
// берем адрес БД из process.env
// const { PORT = 3000, DB_ADDRESS = 'mongodb://0.0.0.0:27017/mestodb' } = process.env;
const { MONGO_URL } = require('./config');

const { PORT = 3000 } = process.env;
// console.log(process.env);
const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {
  login,
  createUser,
} = require('./controllers/users');
const errorsHandler = require('./middlewares/errors-handler');
const auth = require('./middlewares/auth');
const { loginValidator, createUserValidator } = require('./middlewares/validator');

/** подключаемся к серверу mongo */
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // uerCreateIndex: true, // настройки Mongoose
});

/** 2 */
app.use(cors({ origin: 'http://localhost:3000' })); // разрешил кросс-домейн реквесты с этого origin: 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse application/x-www-form-urlencoded
// app.use(express.json());
app.use(helmet()); // защита от некоторых веб-уязвимостей

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter); // Apply the rate limiting middleware to all requests
app.use(morgan('dev'));

/** 3 Routes which handling requests */
// обработчики POST-запросов на роуты: '/signin' и '/signup'
app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);

/** все роуты, кроме /signin и /signup, защищены авторизацией */
app.use('/users', auth, usersRouter); // запросы в корень будем матчить с путями которые прописали в руте юзеров
app.use('/cards', auth, cardsRouter);

/** Любые маршруты не подходящие под созданные роуты, вызовут 404 статус */
app.use((req, res, next) => {
  next(new NotFoundErr(ERR_CODE_404));
});
app.use(errors()); // обработчик ошибок celebrate
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
  next();
});
app.use(errorsHandler);

/** 4 */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
