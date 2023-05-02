/** Контроллер юзера
/* содержит файлы описания моделей пользователя и карточки; */
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  ERR_CODE_400,
  // ERR_CODE_401,
  ERR_CODE_404,
  ERR_CODE_500,
} = require('../errors/errors-codes');
// 200 - success; 201 - success, resource created; 400 - not valid data; 401 - not authorised
// 403 - authorised, no access; 404 - resource not found; 422 - unprocessable entity

/** @param req, POST /users
 * Добавление пользователя без обяз поля avatar - body: { name, about, avatar }
 * @return {Promise}
 * */
// POST /auth/local/register
// POST /signup
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  // получим из объекта req: имя,описание,аватар польз

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    // и вернем/созд док на осн приш. данных.
    // Вернём записаные в базу данные
    .then((user) => res.status(201).send({ data: user })) // В теле запроса на созд польз
    // передайте JSON-объект с
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') { // здесь написан верно!
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// #PW-14
// POST /auth/local
// POST /signin
/** контроллер login, получает из запроса почту и пароль и проверяет их */
const login = (req, res, next) => {
  const { email, password } = req.body;
  // ToDo: 1)find user, 2)check pass.., 3)return jwt & user
  User
    .findOne({ email })
    .orFail(() => res.status(404).send({ message: 'Пользователь или пароль не найден *' }))
    // вызвали у библиоткеи compare - асинхронная. сравнили 2 пароля
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      return res.status(404).send({ message: 'Пользователь или пароль не найден **' });
    }))
    .then((user) => {
      // юзаем библиотеку jsonwebtoken, методом sign создали JWT (внутрь котор записали _id)
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ user, jwt });
    })
    .catch(next);
  // сгенерить jwt токен и вепрнуть его
};

// const login = (req, res, next) => {
//   const { email, password } = req.body;
//   // ToDo: 1)find user, 2)check pass.., 3)return jwt and user
//   User.findUserByCredentials(email, password)
//     .then((user) => { // аутентификация успешна! пользователь в переменной user
//       // вызовем метод jwt.sign, чтобы создать токен, и передадим 2 аргумента:
//       // пейлоуд токена и секретный ключ подписи:
//       const token = jwt.sign(
//         { _id: user._id },
//         'some-secret-key',
//         { expiresIn: '7d' },
//       );
//       // cookie
//       res.cookie('jwt', token, {
//         maxAge: 3600000 * 24 * 7,
//         httpOnly: true,
//         sameSite: true,
//       });
//       res.send({ token }); // вернем токен
//     })
//     .catch((err) => {
//       // ошибка аутентификации
//
//       res.status(ERR_CODE_401).send({ message: err.message });
//     });
// };

// #PW-14
// POST /auth/local/register
// const register = (req, res, next) => {
//   res.status(200).send({ message: "register Ok" })
// };

/** @param req, PATCH /users/me
 * Обновить инфо о пользователе - body: { name, about }
 * user._id - user's ID
 * */
const updateProfileInfo = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('IdNotFoundErr'))
    .then((user) => res.send({ data: user })) // res.status(200) добавл по дефолту
    .catch((err) => {
      if (err.message === 'IdNotFoundErr') {
        res.status(ERR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
    });
};

/** @param req, GET /users
 * Получить всех пользователей
 * @param res
 */
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users })) // res.status(200) добавл по дефолту
    .catch(next);
};
// .catch(() => {
//   res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
// });
// const getUsers = async (req, res, next) => {
//   try {
//     const users = await User.find({});
//     res.send({ data: users });
//   } catch (err) {
//     next(err);
//   }
// };

/** @param req - GET /users/:userId,
 * Получить пользователя по ID (params.userId - ID пользователя)
 * @param res
 */
const getUserById = (req, res) => {
  // const { name, about, avatar } = req.body; // получим из объекта запроса имя,опис,автр польз
  const { userId } = req.params;

  return User.findById(userId)
    // .orFail() // попадем в orFail, если мы не найдем нашего пользователя
    .then((user) => {
      if (user === null) {
        res.status(ERR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.send({ data: user }); // res.status(200) добавл по дефолту
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

// #14 - GET /users/me - возвращает информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  // ToDo: check token, getUser from DB, return username & email
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  // должны получить токен из authorization хедера:
  let payload;
  const jwt = authorization.replace('Bearer ', ''); // вырезаем 'Bearer ' из authorization хедера,
  // тем самым получаем jwt в чистом виде
  // Проверить, валиден ли токен/jwt:
  try {
    payload = jsonwebtoken.verify(jwt, 'some-secret-key');
    // res.send(payload); // в payload хранится: _id, iat,exp
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  // Залезть в BD и получить пользователя
  User
    .findById(payload._id)
    .orFail(() => res.status(404).send({ message: 'Пользователь не найден' }))
    .then((user) => res.send(user))
    .catch(next);
  // res.status(200).send({ message: 'getCurrentUser Ok' });
};

/** @param req, PATCH /users/me/avatar  - Обновить аватар
 * user._id - user's ID
 * body: {avatar} - link
 * */
const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    // .orFail()
    .then((user) => {
      if (!user) {
        res.status(ERR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send({ data: user }); // res.status(200) доб по дефолту
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  createUser,
  login,
  updateProfileInfo,
  getUsers,
  getUserById,
  getCurrentUser,
  updateAvatar,
};
