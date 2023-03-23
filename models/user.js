/** директория models/ содержит файлы описания схем пользователя и карточки; */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // определить поля для пользователя:
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
