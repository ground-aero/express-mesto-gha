// секретное слово для jwt используется в проекте в двух местах,
// при необходимости его изменения нужно будет искать по проекту где оно еще используется.
// Хорошим тоном будет вынесение секрета в отдельную переменную,с выносом в переменные окружения
/** вызов метода config() библиотеки dotenv => ищет в корне файла .env */
require('dotenv').config();
// console.log(process.env);

const {
  JWT_SECRET,
  MONGO_URL,
  NODE_ENV,
} = process.env;

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET',
  MONGO_URL: NODE_ENV === 'production' ? MONGO_URL : 'mongodb://0.0.0.0:27017/mestodb',
};
