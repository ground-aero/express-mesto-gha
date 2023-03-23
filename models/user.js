/** директория models/ содержит файлы описания схем пользователя и карточки; */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // определить поля для пользователя:
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
