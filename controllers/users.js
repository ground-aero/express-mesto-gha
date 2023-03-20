// Контроллер юзера
// содержит файлы описания моделей пользователя и карточки;
const User = require('../models/user');
// 200 - success; 201 - success, resource created; 400 - not valid data; 401 - not authorised
// 403 - authorised, no access; 404 - resource not found; 422 - unprocessable entity

/** Получить всех пользователей
 * @param req, /users, метод GET
 * @param res
 */
const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
  // res.send('hello to getUsers from server..')

/** Получить пользователя по ID
 * @param req - /users/:userId, params.userId - ID пользователя, метод GET
 * @param res
 */
const getUser = (req, res) => {
  // const { name, about, avatar } = req.body; // получим из объекта запроса имя, опис, автр польз
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
  // const user = users.find((item) => item._id === id);
  // res.send(user);
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта req: имя,описание,аватар польз
  return User.create({ name, about, avatar }) // созд док на осн приш. данных.
    // Вернём записаные в базу данные
    .then((user) => { res.status(201).send(user); }) // В теле запроса на созд польз
    // передайте JSON-объект с
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: `an error occurred ${err}` }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
