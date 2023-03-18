const router = require('express').Router();
const { createUser, getUser, getUsers } = require('../controllers/users');
// const User = require('../models/user');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUser); // возвращает пользователя по _id
// создаёт пользователя
router.post('/users', createUser); // В теле запроса на создание польз передайте JSON-объект с тремя полями: name,about, avatar

module.exports = router;
