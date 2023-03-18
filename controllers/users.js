const User = require('../models/user');

// 200 - success
// 201 - success, resource created
// 400 - not valid data
// 401 - not authorised
// 403 - authorised, no access
// 404 - resource not found
// 422 - unprocessable entity

const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя, описание, автр польз

  return User.create(req.body) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then((user) => res.status(201).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: `an error occurred ${err}` }));
};

const getUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя, опис, автр польз
};

const getUsers = (req, res) => { };

module.exports = { createUser, getUser, getUsers };
