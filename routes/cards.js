/** routes/ для cards содержит описание основных роутов для карточки. */
const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const { cardValidator, cardIdValidator } = require('../middlewares/validator');

/** 'cards' можем удалить, рут теперь работает относительно урла, а не всего приложения */
/** Handle incoming @requests to /users */
router.get('/', getCards); // возвр. все карточки, 'cards' можем удалять. 2-й аргумент это ф-ция контроллер.
// создаёт карточку
router.use(auth); /** 7. Защита авторизацией всех остальных роутов */
router.post('/', cardValidator, createCard); // В теле запроса на создание карточки перед JSON-объект с полями: name, link
// router.get('/:userId', getUser); // возвращ польз по _id. 2-й аргум -это ф-ция контроллер.
router.delete('/:cardId', cardIdValidator, deleteCard); // 9. Проконтр. права. Нельзя удал карт др польз-лей
// PUT /cards/:cardId/likes — поставить лайк карточке
router.put('/:cardId/likes', cardIdValidator, likeCard);
// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete('/:cardId/likes', cardIdValidator, dislikeCard);

/** экспортируем сущность которая внутри данного файла. Он отвечает только за юзера (!) */
module.exports = router;
