// app.js включает основную логику сервера, запуск и подключение к базе данных;
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

/** подключаемся к серверу mongo */
// mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
// mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
//   // useNewUrlParser: true,
//   // useCreateIndex: true,
//   // useFindAndModify: false,
// });
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

/** 1 */
const app = express();

/** 2 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// parse application/json
app.use(bodyParser.json());

/** 3 routes */
app.use('/', usersRouter); // запросы в корень будем матчить с путями которые прописали в руте юзеров

/** 4 */
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
