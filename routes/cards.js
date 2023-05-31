/** routes/ для cards содержит описание основных роутов для карточки. */
const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const { cardValidator, cardIdValidator } = require('../middlewares/validator');

/** 'cards' удалили, роут теперь работает относительно урла, а не всего приложения */
router.get('/', getCards); // возвр. все карточки. 2-й арг. это ф-ция контроллер. создаёт карточку
router.use(auth); /** 7. Защита авторизацией всех остальных роутов */
router.post('/', cardValidator, createCard); // В теле запроса на созд карточки
// перед JSON-объект с полями: name, link
router.delete('/:cardId', cardIdValidator, deleteCard); // Проконтр права.Нельзя уд. карт др.польз
router.put('/:cardId/likes', cardIdValidator, likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = router;
