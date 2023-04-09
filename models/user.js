/** директория models/ содержит файлы описания схем пользователя и карточки; */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({ // определить поля для пользователя:
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "поле email должно быть заполнено",
    },
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
