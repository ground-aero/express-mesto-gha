// Контроллер юзера
// содержит файлы описания моделей пользователя и карточки;
// const NotFoundErr = require('../errors/not-found-err');
// const IncorrectDataErr = require('../errors/incorrect-data-err');
const User = require('../models/user');
const {
  ERR_CODE_400,
  ERR_CODE_404,
  ERR_CODE_500,
} = require('../errors/errors-codes');
// 200 - success; 201 - success, resource created; 400 - not valid data; 401 - not authorised
// 403 - authorised, no access; 404 - resource not found; 422 - unprocessable entity

/** Обработчик ответа сервера, при работе с пользователями
 * @param user
 * @param res
 */
// const userResHandler = (user, res) => (
//   user
//     ? res.status(200).send({ data: user }) // ID пользака найден в БД, отправить пользователя
//     : res.status(404).send({
//     message: 'Пользователь с указанным _id не найден' }) // ID не найден в БД
// );

/** Обработчик ошибок, от сервера
 * @param err
 * @param res
 */
// const serverErrHandler = (err, res) => (
//   err.name === 'CastError' || err.name === 'ValidationError'
//     ? res.status(400).send({ message: 'Переданы некорректные данные ' })
//     : res.status(500).send({ message: 'Ошибка по умолчанию' })
// );

/** Обновить инфо о пользователе - body: { name, about }
 * @param req /users/me, PATCH method
 * user._id - user's ID
 * */
const updateProfileInfo = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(_id, { name, about })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
    });
};
// const updateProfileInfo = (req, res) => {
//   const { _id } = req.user;
//   const { name, about } = req.body;
//
//   return User.findByIdAndUpdate(_id, { name, about })
//     .then((user) => {
//       userResHandler(user, res); // обработчик ответа
//     })
//     .catch((err) => {
//       serverErrHandler(err, res); // обработчик ошибок от сервера
//     });
// };
// const updateProfileInfo = (req, res, next) => {
//   const { _id } = req.user;
//   const { name, about } = req.body;
//
//   return User.findByIdAndUpdate(_id, { name, about })
//     .orFail()
//     .then((user) => res.status(200).send({ data: user }))
//     .catch((err) => res.status(500).send({
//     message: `server error when updateProfileInfo: ${err}` }));
// };

/** Получить всех пользователей
 * @param req, /users, метод GET
 * @param res
 */
const getUsers = (req, res) => User.find({})

  .then((users) => res.status(200).send({ data: users }))
  .catch((err) => {
    if (err.name === 'IncorrectDataErr') { // 400
      res.status(err.status).send({ message: `Переданы некорректные данные при создании пользователя ${err}` });
    } else {
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  });
// const getUsers = (req, res) => User.find({})
//   .orFail(() => {
//     throw new IncorrectDataErr();
//   })
//   .then((users) => res.status(200).send({ data: users }))
//   .catch((err) => {
//     if (err.name === 'IncorrectDataErr') {
//       res.status(err.status).send(err);
//     } else {
//       res.status(500).send({ message: `Internal server error: ${err}` });
//     }
//   });

/** Получить пользователя по ID
 * @param req - /users/:userId, params.userId - ID пользователя, метод GET
 * @param res
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(ERR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
    }
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
    }
    // res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
  }
};
// const getUserById = (req, res) => {
//   // const { name, about, avatar } = req.body; // получим из объекта запроса имя,опис,автр польз
//   const { userId } = req.params;
//
//   User.findById(userId)
//     .orFail(() => {
//       throw new NotFoundErr('Пользователь по указанному _id не найден');
//     }) // мы попадем в orFail, если мы не найдем нашего пользователя
//     .then((user) => res.status(200).send({ data: user }))
//     .catch((err) => {
//       if (err.name === 'NotFoundErr') {
//         res.status(err.status).send(err);
//       } else {
//         res.status(500).send({ message: `Internal server error: ${err}` });
//       }
//     });
// };

const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта req: имя,описание,аватар польз
  return User.create({ name, about, avatar }) // созд док на осн приш. данных.
    // Вернём записаные в базу данные
    .then((user) => res.status(201).send(user)) // В теле запроса на созд польз
    // передайте JSON-объект с
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') { // здесь написан верно!
        res.status(400).send({ message: `Error validating user: ${err}` });
      } else {
        res.status(500).send({ message: `Internal server error: ${err}` });
      }
    });
  // .catch((err) => res.status(500).send({ message: `an error occurred ${err}` }));
};

/** Обновить аватар
 * @param req /users/me/avatar, PATCH method
 * user._id - user ID
 * body: {avatar} - link
 * user._id - user's ID
 * */
const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.user;

  return User.findOneAndUpdate(_id, { avatar })
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(500).send({ message: `server error when updateAvatar ${err}` }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfileInfo,
  updateAvatar,
};
