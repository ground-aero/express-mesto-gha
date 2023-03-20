// Контроллер создания карточки
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
 * @param res
 */
const createCard = (req, res) => {
  console.log(req.user._id);// _id станет доступен. Мы захардкодили идентификатор пользователя,
  // кто бы ни создал карточку, в базе у неё будет один и тот же автор

  const { name, link } = req.body;

  return Card.create({ name, link }) // созд док на осн приш. данных.
    // Вернём записаные в базу данные
    .then((card) => { res.status(201).send(card); }) // В теле запроса на созд карточки
    // передайте JSON-объект с
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: `an error occurred ${err}` }));
};

/** Удаляет карточку
 * @param req, /cards/:cardId — удаляет карточку по идентификатору, метод DELETE
 * @param res
 */
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => { res.status(500).send({ message: 'Ошибка сервера' }) });
}

module.exports = { getCards, createCard, deleteCard };