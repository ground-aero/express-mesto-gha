// директория routes/ содержит описание основных роутов для пользователя и карточки.
const router = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users');
// const User = require('../models/user');

/** 'users' можем удалить, рут теперь работает относительно урла, а не всего приложения */
router.get('/', getUsers); // возвр. всех польз-лей, 'users' можем удалять. 2-й аргумент это ф-ция контроллер.
router.get('/:userId', getUser); // возвращает пользователя по _id. 2-й аргумент -это ф-ция контроллер.
// создаёт пользователя
router.post('/', createUser); // В теле запроса на создание польз передайте JSON-объект с тремя полями: name,about, avatar

/** экспортируем сущность которая внутри данного файла. Он отвечает только за юзера (!) */
module.exports = router;
