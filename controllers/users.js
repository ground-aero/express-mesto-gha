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

/** Добавление пользователя без обяз поля avatar - body: { name, about, avatar }
 * @param req /users, POST method
 * @return {Promise}
 * */
const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта req: имя,описание,аватар польз
  return User.create({ name, about, avatar }) // созд док на осн приш. данных.
    // Вернём записаные в базу данные
    .then((user) => res.send({ data: user })) // В теле запроса на созд польз
    // передайте JSON-объект с
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') { // здесь написан верно!
        res.status(ERR_CODE_400).send({ message: `Переданы некорректные данные при создании пользователя: ${err}` });
      } else {
        res.status(ERR_CODE_500).send({ message: `Ошибка по умолчанию: ${err}` });
      }
    });
};

/** Обновить инфо о пользователе - body: { name, about }
 * @param req /users/me, PATCH method
 * user._id - user's ID
 * */
const updateProfileInfo = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(_id, { name, about }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

/** Получить всех пользователей
 * @param req, /users, метод GET
 * @param res
 */
const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch((err) => {
    res.status(ERR_CODE_500).send({ message: `Ошибка по умолчанию: ${err}` });
  });

/** Получить пользователя по ID
 * @param req - /users/:userId, params.userId - ID пользователя, метод GET
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
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR_CODE_500).send({ message: `Ошибка по умолчанию: ${err}` });
      }
    });
};

/** Обновить аватар
 * @param req /users/me/avatar, PATCH method
 * user._id - user ID
 * body: {avatar} - link
 * user._id - user's ID
 * */
const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  return User.findOneAndUpdate(_id, { avatar })
    // .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        err.status(ERR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send({ message: `Переданы некорректные данные при обновлении аватара: ${err}` });
      } else {
        res.status(ERR_CODE_500).send({ message: `Ошибка по умолчанию: ${err}` });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfileInfo,
  updateAvatar,
};
