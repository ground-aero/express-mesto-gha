/** директория models/ содержит файлы описания схем пользователя и карточки; */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({ // определить поля для пользователя:
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'поле email должно быть валидным email-адресом',
    },
  },
  password: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
