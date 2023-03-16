const User = require('../models/user');

module.exports.getUser = (req, res) => {
  
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body; // получим из объекта запроса имя, описание, автвар пользователя

  User.create({name, about, avatar}) // создадим документ на основе пришедших данных
    // вернём записанные в базу данные
    .then(user => res.send({data: user}))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send({message: 'an error occurred'}));
}