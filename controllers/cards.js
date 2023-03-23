// Контроллер создания карточки
// const NotFoundErr = require('../errors/not-found-err');
// const IncorrectDataErr = require('../errors/incorrect-data-err');
const Card = require('../models/card');
const {
  ERR_CODE_400,
  ERR_CODE_404,
  ERR_CODE_500,
} = require('../errors/errors-codes');

/** Создает карточку | {name - имя изображ, link - ссылка}
 * @param req, /cards, метод POST
 * user._id - ID польз.
 * @return {Promise}
 */
const createCard = (req, res) => {
  // console.log(req.user._id);// _id станет доступен. Мы захардкодили идентификатор пользователя,
  // кто бы ни создал карточку, в базе у неё будет один и тот же автор
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner }) // созд док на осн приш. данных.
    // Вернём записаные в базу данные
    .then((card) => res.status(201).send({ data: card })) // В теле запроса на созд карточки
    // передайте JSON-объект с
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send({ message: `Переданы некорректные данные при создании карточки: ${err}` });
      } else {
        res.status(ERR_CODE_500).send({ message: `Ошибка по умолчанию: ${err}` });
      }
    });
};

/** Возвращает все карточки
 * @param req, /cards, метод GET
 * @param res
 */
const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' }));

/** Удаляет карточку
 * @param req, /cards/:cardId — удаляет карточку по идентификатору, метод DELETE
 * body - { name, link }
 * url: "http://localhost:3000/cards/63f51181c8aa784600ac5693"
 * @param res
 */
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ message: 'Карточка удалена' });
      } else {
        res.status(ERR_CODE_404).send({ message: 'Карточка с указанным _id не найдена' });
      }
    })
    // .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: `Переданы некорректные данные  ${err}` });
      } else {
        res.status(500).send({ message: `Ошибка по умолчанию: ${err}` });
      }
    });
};

/** поставить лайк карточке
 * @param req, /cards/:cardId/likes , PUT method
 * url: "http://localhost:3000/cards/63f61dfbc7eee15ca4adc16e/likes"
 * @param res
 */
const likeCard = (req, res) => {
  const {cardId} = req.params;
  const {_id} = req.user;

  // добавить _id польз-ля в массив лайков, если его в нем нет
  Card.findByIdAndUpdate(cardId, {$addToSet: {likes: _id}}, {new: true})
    .orFail(new Error('idNotFoundError'))
    .then((card) => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'idNotFoundError') {
        res.status(ERR_CODE_404).send({message: `Передан несуществующий _id карточки: ${err}`})
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные для постановки лайка' })
      }
      else {
        res.status(ERR_CODE_500).send({message: `Ошибка сервера: ${err}`})
      }
    });
};

/** убрать лайк с карточки
 * @param req, /cards/:cardId/likes , DELETE method
 * @param res
 */
const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    // убрать _id из массива польз-ля
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера: ${err}` }));
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
