/** Контроллер юзера
/* содержит файлы описания моделей пользователя и карточки; */
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
// const {
//   ERR_CODE_400,
//   // ERR_CODE_401,
//   ERR_CODE_404,
//   ERR_CODE_500,
// } = require('../errors/errors-codes');
const BadRequestErr = require('../errors/bad-req-err');
const ConflictErr = require('../errors/conflict-err');
const NotFoundErr = require('../errors/not-found-err');
// 200 - success; 201 - success, resource created; 400 - not valid data; 401 - not authorised
// 403 - authorised, no access; 404 - resource not found; 422 - unprocessable entity

/** @param req, POST /users
 * Добавление пользователя без обяз поля avatar - body: { name, about, avatar }
 * @return {Promise}
 * */
// front: POST /auth/local/register
// back: POST /signup
const createUser = (req, res, next) => {
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
    .then((user) => res.status(201).send({
      data: {
        _id: user._id,
        name,
        about,
        avatar,
        email,
      },
    })) // В теле запроса на созд польз
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictErr('Такой логин-емейл уже существует! (409)'));
      }
      if (err.name === 'ValidationError') { // здесь написан верно!
        return next(new BadRequestErr('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
  // .catch(next);
};

/** @param req, GET /users
 * Получить всех пользователей
 * @param res
 */
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users })) // res.status(200) добавл по дефолту
    .catch(next);
};

// POST /auth/local
// POST /signin
/** контроллер login, получает из запроса почту и пароль и проверяет их */
const login = (req, res, next) => {
  const { email, password } = req.body;
  // ToDo: 1)find user, 2)check pass.., 3)return jwt & user
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // юзаем библиотеку jsonwebtoken, методом sign создали JWT (внутрь котор записали _id)
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jsonwebtoken', jwt, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ user, jwt });
    })
    .catch(next);
};

// #PW-14
// POST /auth/local/register

/** @param req - GET /users/:userId,
 * Получить пользователя по ID (params.userId - ID пользователя)
 * @param res
 */
const getUserById = (req, res, next) => {
  // const { name, about, avatar } = req.body; // получим из объекта запроса имя,опис,автр польз
  const { userId } = req.params;

  return User.findById(userId)
    // .orFail() // попадем в orFail, если мы не найдем нашего пользователя
    .then((user) => {
      if (user === null) {
        return next(new NotFoundErr('Пользователь по указанному _id не найден'));
      }
      return res.send({ data: user }); // res.status(200) добавл по дефолту
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные'));
        // res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      return next(err);
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
    .then((user) => res.status(200).send({
      data: user,
    }))
    .catch(next);
  // res.status(200).send({ message: 'getCurrentUser Ok' });
};

/** @param req, PATCH /users/me
 * Обновить инфо о пользователе - body: { name, about }
 * user._id - user's ID
 * */
const updateProfileInfo = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    // .orFail(() => new NotFoundErr('Такой пользователь не найден'))
    .then((user) => {
      res.send({ data: user }); // res.status(200) добавл по дефолту
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestErr(err.message));
      }
      return next(err);
    });
};

/** @param req, PATCH /users/me/avatar  - Обновить аватар
 * user._id - user's ID
 * body: {avatar} - link
 * */
const updateAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  // return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
  return User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    // .orFail()
    .then((user) => {
      if (!user) {
        return next(new NotFoundErr('Пользователь с указанным _id не найден'));
      }
      return res.send({ data: user }); // res.status(200) доб по дефолту
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getUsers,
  login,
  getUserById,
  getCurrentUser,
  updateProfileInfo,
  updateAvatar,
};
