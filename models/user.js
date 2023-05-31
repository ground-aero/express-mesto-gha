/** директория models/ содержит файлы описания схем пользователя и карточки; */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AuthoErr = require('../errors/autho-err');
const {
  isURL,
} = require('../utils/utils');

const userSchema = new mongoose.Schema({ // определить поля для пользователя:
  // _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: false,
    minlength: [2, 'Min length of "name" is - 2 symbols'],
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: [2, 'Min length of "about" is - 2 symbols'],
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (link) => isURL(link), // join('')
      message: 'не является валидной URL ссылкой!',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'your "email" is to be filled-in'],
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'your email should be a valid email-address',
    },
  },
  password: {
    type: String,
    required: [true, 'your password is required'],
    select: false, // Так по умолчанию хеш пароля польз-ля не будет возвращаться из базы
  },
}, { versionKey: false });

/** добавим метод findUserByCredentials схеме пользователя
 * у него будет два параметра — почта и пароль */
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  // ToDo: 1)пытаемся найти user(-а) по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new AuthoErr('Неправильные почта или пароль..'));
      }
      // Todo: если user нашёлся — то сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthoErr('Неправильные почта или пароль***'));
          }
          return user; /** теперь user доступен */
        });
    });
};

module.exports = mongoose.model('user', userSchema);
