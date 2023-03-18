const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const usersRouter = require('./routes/users');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

// подключаемся к серверу mongo
// mongoose.connect('mongodb://27017/mestodb');
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', usersRouter); // запросы в корень будем матчить с путями которые прописали в руте юзеров

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
