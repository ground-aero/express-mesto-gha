/** Контроллер создания карточки */
const Card = require('../models/card');
const NotFoundErr = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');
const BadRequestErr = require('../errors/bad-req-err');

/** Создает карточку | {name - имя изображ, link - ссылка}
 * @param req, /cards, метод POST
 * user._id - ID польз.
 * @return {Promise}
 */
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  // const { _id } = req.user._id;
  return (
    Card.create({ name, link, owner: req.user._id }) // этот идентифик записыв в поле owner
      // при создании новой карточки
      // Вернём записаные в базу данные
      .then((card) => res.status(201).send({ data: card })) // В теле запроса на созд карточки
      // передайте JSON-объект
      /** данные не записались, вернём ошибку */
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestErr('Переданы некорректные данные при создании карточки'));
        } else {
          next(err);
        }
      })
  );
};

/** Возвращает все карточки
 * @param req, /cards, метод GET
 * @param res
 */
const getCards = (req, res, next) => Card.find({})
  .populate(['owner', 'likes']) // достанем поле owner, и поле likes
  .then((cards) => res.send({ data: cards })) // res.status(200) по дефолту
  .catch(next);
  // .catch(() => res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' }));

/** Удаляет карточку
 * @param req, /cards/:cardId — удаляет карточку по идентификатору, метод DELETE
 * body - { name, link }
 * url: "http://localhost:3000/cards/63f51181c8aa784600ac5693"
 * @param res
 */
const deleteCard = (req, res, next) => {
  const { cardId } = req.params; // extract ID from URL
  return Card.findById(cardId)
    .orFail(() => new NotFoundErr('По заданному ID карточки нет'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) { // req.user._id - это
        return next(new ForbiddenErr('Нельзя удалить чужую карточку!'));
      }
      return card.deleteOne()
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestErr('Невалидный ID карточки')); // попадет в централиз обработч ошибок
      } else {
        next(err);
      }
    });
};

/** поставить лайк карточке
 * @param req, /cards/:cardId/likes , PUT method
 * url: "http://localhost:3000/cards/63f61dfbc7eee15ca4adc16e/likes"
 * @param res
 */
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  // const ownerId = req.user._id;
  // const { _id } = req.user;
  /** добавить _id польз-ля в массив лайков, если его в нем нет */
  // const { params: { cardId } } = req;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch(() => {
      throw new NotFoundErr('Нет карточки с таким ID (404)');
    })
    .catch(next);
};

/** убрать лайк с карточки
 * @param req, /cards/:cardId/likes , DELETE method
 * @param url: "http://localhost:3000/cards/641c0bc1dd5e92e6717d97bd/likes"
 */
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  // const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    /** убрать _id из массива польз-ля */
    .orFail()
    .then((card) => res.send({ data: card })) // res.status(200) по дефолту
    .catch(() => {
      next(new NotFoundErr('Нет карточки с таким ID (err 404)'));
    })
    .catch(next);
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
