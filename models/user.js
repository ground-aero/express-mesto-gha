/** директория models/ содержит файлы описания схем пользователя и карточки; */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // определить поля для пользователя:
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxLength: [30, 'maximum length is 30 symbols...'],
    // default: 'Eugene',
  },
  about: {
    type: String,
    minLength: 2,
    maxlength: [30, 'maximum length is 30 symbols...'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
