// Контроллер создания карточки
const NotFoundErr = require('../errors/not-found-err');
const IncorrectDataErr = require('../errors/incorrect-data-err');
const Card = require('../models/card');

/** Возвращает все карточки
 * @param req, /users, метод GET
 * @param res
 */
const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
// res.send('hello to getUsers from server..')

/** Создает карточку
 * @param req, /cards, метод POST
 * {name - имя изображ, link - ссылка}
 * user._id - ID польз.
 * @return {Promise}
 */
const createCard = (req, res, next) => {
  // console.log(req.user._id);// _id станет доступен. Мы захардкодили идентификатор пользователя,
  // кто бы ни создал карточку, в базе у неё будет один и тот же автор

  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner }) // созд док на осн приш. данных.
    // Вернём записаные в базу данные
    .then((card) => { res.status(201).send(card); }) // В теле запроса на созд карточки
    // передайте JSON-объект с
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'IncorrectDataErr') {
        next(new IncorrectDataErr(`Incorrect Data card: ${err}`));
        // res.status(400).send({ message: `Error validating user: ${err}` });
      } else {
        res.status(500).send({ message: `Internal server error: ${err}` });
      }
    });
  // .catch((err) => res.status(500).send({ message: `an error occurred ${err}` }));
};

/** Удаляет карточку
 * @param req, /cards/:cardId — удаляет карточку по идентификатору, метод DELETE
 * @param res
 */
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      // мы попадем в orFail, если не найдем карточку
      throw new NotFoundErr();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundErr') {
        res.status(err.status).send(err);
      } else {
        res.status(500).send({ message: `Internal server error: ${err}` });
      }
    });
  // .catch((err) => res.status(500).send({ message: `Ошибка сервера: ${err}` }));
};

/** поставить лайк карточке
 * @param req, /cards/:cardId/likes , PUT method
 * @param res
 */
const likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  // добавить _id польз-ля в массив лайков, если его в нем нет
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера: ${err}` }));
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
