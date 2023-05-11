/** директория models/ содержит файлы описания схем пользователя и карточки; */
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    minlength: [2, 'minimal length is 2 symbols...'],
    maxlength: [30, 'maximum length is 30 symbols...'],
    trim: true,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  /** создаём поле owner */
  owner: {
    type: mongoose.Schema.Types.ObjectId, // сохран идентификатор карточки
    ref: 'user', // ссылка на модель автора карточки
    required: true,
  },
  likes: [ // список лайкнувших пост пользователей
    {
      type: mongoose.Schema.Types.ObjectId, // массив ObjectId
      default: [], // по умолчанию — пустой массив.
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
