// routes/ содержит описание основных роутов для пользователя и карточки.
const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');
// const Card = require('../models/card');

/** 'cards' можем удалить, рут теперь работает относительно урла, а не всего приложения */
router.get('/', getCards); // возвр. все карточки, 'cards' можем удалять. 2-й аргумент это ф-ция контроллер.
// router.get('/:userId', getUser); // возвращает пользователя по _id. 2-й аргумент -это ф-ция контроллер.
// создаёт карточку
router.post('/', createCard); // В теле запроса на создание карточки перед JSON-объект с полями: name, link
router.delete('/:cardId', deleteCard);

/** экспортируем сущность которая внутри данного файла. Он отвечает только за юзера (!) */
module.exports = router;