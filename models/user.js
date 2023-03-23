/** директория models/ содержит файлы описания схем пользователя и карточки; */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // определить поля для пользователя:
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: [30, 'maximum length is 30 symbols...'],
    // default: 'Eugene',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: [30, 'maximum length is 30 symbols...'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://lumiere-a.akamaihd.net/v1/images/p_avatar_de27b20f.jpeg',
  },
});

module.exports = mongoose.model('user', userSchema);
