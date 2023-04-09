/** Контроллер юзера
/* содержит файлы описания моделей пользователя и карточки; */
const User = require('../models/user');
const {
  ERR_CODE_400,
  ERR_CODE_404,
  ERR_CODE_500,
} = require('../errors/errors-codes');
// 200 - success; 201 - success, resource created; 400 - not valid data; 401 - not authorised
// 403 - authorised, no access; 404 - resource not found; 422 - unprocessable entity

/** @param req, POST /users
 * Добавление пользователя без обяз поля avatar - body: { name, about, avatar }
 * @return {Promise}
 * */
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body; // получим из объекта req: имя,описание,аватар польз
  return User.create({ name, about, avatar, email, password }) // и вернем/созд док на осн приш. данных.
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
// POST /auth/local/register
const register = (req, res, next) => {
  res.status(200).send({ message: "register Ok" })
};

const login = (req, res, next) => {
  res.status(200).send({ message: "login Ok" })
};

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
const getUsers = (req, res) => User.find({})
  .then((users) => res.send({ data: users })) // res.status(200) добавл по дефолту
  .catch(() => {
    res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
  });

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

/** @param req, PATCH /users/me/avatar
 * Обновить аватар
 * user._id - user ID
 * body: {avatar} - link
 * user._id - user's ID
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
  register,
  login,
  updateProfileInfo,
  getUsers,
  getUserById,
  updateAvatar,
};
