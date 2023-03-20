// директория models/ содержит файлы описания схем пользователя и карточки;
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'minimal length is 2 symbols...'],
    maxlength: [30, 'maximum length is 30 symbols...'],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // будем хранить идентификатор ....???????? карточки
    ref: 'user', // ссылка на модель автора карточки ?????????????????????????????????
    required: true,
  },
  likes: { // список лайкнувших пост пользователей
    default: [], // по умолчанию — пустой массив
    type: mongoose.Schema.Types.ObjectId, // массив ObjectId
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
