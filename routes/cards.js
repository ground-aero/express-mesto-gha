// routes/ содержит описание основных роутов для пользователя и карточки.
const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
// const Card = require('../models/card');

/** 'cards' можем удалить, рут теперь работает относительно урла, а не всего приложения */
router.get('/', getCards); // возвр. все карточки, 'cards' можем удалять. 2-й аргумент это ф-ция контроллер.
// router.get('/:userId', getUser); // возвращ польз по _id. 2-й аргум -это ф-ция контроллер.
// создаёт карточку
router.post('/', createCard); // В теле запроса на создание карточки перед JSON-объект с полями: name, link
router.delete('/:cardId', deleteCard);
// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/:cardId/likes', likeCard);
// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/:cardId/likes', dislikeCard);

/** экспортируем сущность которая внутри данного файла. Он отвечает только за юзера (!) */
module.exports = router;
