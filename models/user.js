const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // определить поля для пользователя:
  name: {
    type: String,
    minlength: [2, 'minimal length is 2 symbols...'],
    maxlength: 30,
    required: false,
    default: 'Eugene',
  },
  about: {
    type: String,
    minlength: [2, 'minimal length is 2 symbols...'],
    maxlength: [30, 'maximum length is 30 symbols...'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://lumiere-a.akamaihd.net/v1/images/p_avatar_de27b20f.jpeg',
  },
});

// const cardSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: [2, 'minimal length is 2 symbols...'],
//     maxlength: [30, 'maximum length is 30 symbols...'],
//     required: true,
//   },
//   link: {
//     type: String,
//     required: true,
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId, // будем хранить идентификатор ....???????? карточки
//     ref: 'user', // ссылка на модель автора карточки ?????????????????????????????????
//     required: true,
//   },
//   likes: { // список лайкнувших пост пользователей
//     type: mongoose.Schema.Types.ObjectId, // массив ObjectId
//     default: [], // по умолчанию — пустой массив
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

module.exports = mongoose.model('User', userSchema);
