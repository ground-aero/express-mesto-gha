/** Контроллер создания карточки */
const Card = require('../models/card');
const {
  ERR_CODE_400,
  ERR_CODE_404,
  ERR_CODE_500,
} = require('../errors/errors-codes');
const NotFoundErr = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');
const BadRequestErr = require('../errors/bad-req-err');

/** Создает карточку | {name - имя изображ, link - ссылка}
 * @param req, /cards, метод POST
 * user._id - ID польз.
 * @return {Promise}
 */
const createCard = (req, res) => {
  // console.log(req.user._id); // _id станет доступен. Мы захардкодили идентификатор пользователя,
  // кто бы ни создал карточку, в базе у неё будет один и тот же автор
  const { name, link } = req.body;
  const owner = req.user._id;
  // const { _id } = req.user._id;
  // console.log(_id);
  // const { user } = req.body;

  return Card.create({ name, link, owner }) // этот идентификатор записыв в поле owner
    // при создании новой карточки
    // Вернём записаные в базу данные
    .then((card) => res.status(201).send({ data: card })) // В теле запроса на созд карточки
    // передайте JSON-объект с
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
// const createCard = (req, res) => {
//   // console.log(req.user._id); // _id станет доступен. Мы захардкодили идентификатор пользователя,
//   // кто бы ни создал карточку, в базе у неё будет один и тот же автор
//   const { name, link } = req.body;
//   const ownerId = req.user._id;
//   // const { _id } = req.user._id;
//   // console.log(_id);
//   // const { user } = req.body;
//
//   return Card.create({ name, link, owner: ownerId }) // этот идентификатор записыв в поле owner
//     // при создании новой карточки
//     // Вернём записаные в базу данные
//     .then((card) => res.status(201).send({ data: card })) // В теле запроса на созд карточки
//     // передайте JSON-объект с
//     // данные не записались, вернём ошибку
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки' });
//       } else {
//         res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
//       }
//     });
// };

/** Возвращает все карточки
 * @param req, /cards, метод GET
 * @param res
 */
const getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes']) // достанем поле owner, и поле likes
  .then((cards) => res.send({ data: cards })) // res.status(200) добавл по дефолту
  // .then((cards) => {
  //   console.log(cards, req.user)
  // })
  .catch(() => res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' }));

/** Удаляет карточку
 * @param req, /cards/:cardId — удаляет карточку по идентификатору, метод DELETE
 * body - { name, link }
 * url: "http://localhost:3000/cards/63f51181c8aa784600ac5693"
 * @param res
 */
const deleteCard = (req, res, next) => {
  const { cardId } = req.params; // extract ID from URL
  Card.findById(cardId)
    .orFail(() => new NotFoundErr('Нет карточки по заданному ID'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenErr('Нельзя удалить чужую карточку!'));
      } else {
        return card.deleteOne()
          .then(() => res.send({ data: card }))
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestErr('Невалидный ID карточки'));
      } else {
        next(err);
      }
    })

};
// const deleteCard = (req, res) => {
//   const { cardId } = req.params; // extract ID from URL
//   // const owner = req.owner._id;
//   const id = req.user._id;
//   Card.findById(cardId)
//     // .populate('owner', '_id')
//     .orFail(() => {
//       const error = new Error('Карточка по заданному ID отсутствует в Базе');
//       error.statusCode = 404;
//       return error;
//     })
//     .then((card) => {
//       console.log(card);
//       if (card.owner.toString() !== id) {
//         throw new ForbiddenErr({ message: 'Нет прав на удаление карточки' });
//       }
//       Card.findByIdAndDelete(cardId)
//         .then((cardDeleted) => {
//           res.send({ data: cardDeleted });
//         })
//         .catch(err => {
//           if (err.name === 'CastError') {
//             res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
//           } else {
//             res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
//           }
//         })
//     })
//     .catch((err) => {
//       if (err.statusCode === 404) {
//         res.status(ERR_CODE_404).send({ message: 'Карточка с указанным ID не найдена' });
//         return;
//       }
//       if (err.name === 'CastError') {
//         res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
//         return;
//       }
//       if (err.name === 'ValidationError') {
//         res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
//         return;
//       }
//       res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
//     })
// };
  // Card.findByIdAndDelete(cardId)
  //   .populate(['owner', '_id'])
  //   .then((card) => {
  //     res.send({ data: card, message: 'Карточка удалена.....' }); // res.status(200) доб по дефолту
  //   })
  //   .catch((err) => {
  //     if (err.name === 'CastError') {
  //       res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
  //     } else {
  //       res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
  //     }
  //   });
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
  //   } else {
  //     res.status(500).send({ message: 'Ошибка по умолчанию' });
  //   }
  // })
// };
// const deleteCard = (req, res) => {
//   const { cardId } = req.params;
//   // const owner = req.owner._id;
//
//   Card.findById(cardId)
//     .populate('owner')
//     .orFail()
//     .catch(() => {
//       throw new NotFoundErr({ message: 'карточка с таким id не найдена,kdl;kj;d ' });
//       // res.send({ message: 'нет такой карточки' })
//     })
//     .then((card) => {
//       res.send({ data: card, message: 'Карточка найдена.....' }); // res.status(200) доб по дефолту
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
//       } else {
//         res.status(500).send({ message: 'Ошибка по умолчанию' });
//       }
//     });
//   Card.findByIdAndDelete(cardId)
//     .populate(['owner', '_id'])
//     .then((card) => {
//       res.send({ data: card, message: 'Карточка удалена.....' }); // res.status(200) доб по дефолту
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
//       } else {
//         res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
//       }
//     });
//   // .catch((err) => {
//   //   if (err.name === 'CastError') {
//   //     res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
//   //   } else {
//   //     res.status(500).send({ message: 'Ошибка по умолчанию' });
//   //   }
//   // })
// };
// const deleteCard = (req, res) => {
//   const { cardId } = req.params;
//   // const owner = req.owner._id;
//
//   return Card.findByIdAndRemove(cardId)
//     .populate('owner')
//     .then((card) => {
//       if (card) {
//         res.send({ data: card, message: 'Карточка удалена' }); // res.status(200) доб по дефолту
//       } else {
//         res.status(ERR_CODE_404).send({ message: 'Карточка с указанным _id не найдена' });
//       }
//     })
//     // .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные' });
//       } else {
//         res.status(500).send({ message: 'Ошибка по умолчанию' });
//       }
//     });
// };

/** поставить лайк карточке
 * @param req, /cards/:cardId/likes , PUT method
 * url: "http://localhost:3000/cards/63f61dfbc7eee15ca4adc16e/likes"
 * @param res
 */
const likeCard = (req, res) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  // const { _id } = req.user;
  // добавить _id польз-ля в массив лайков, если его в нем нет
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: ownerId } }, { new: true })
    .orFail(new Error('idNotFoundError'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'idNotFoundError') {
        res.status(ERR_CODE_404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
// const likeCard = (req, res) => {
//   const { cardId } = req.params;
//   // const ownerId = req.user._id;
//   const { _id } = req.user;
//   // добавить _id польз-ля в массив лайков, если его в нем нет
//   Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
//     .orFail(new Error('idNotFoundError'))
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       if (err.message === 'idNotFoundError') {
//         res.status(ERR_CODE_404).send({ message: 'Передан несуществующий _id карточки' });
//         return;
//       }
//       if (err.name === 'CastError') {
//         res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные для
//         постановки лайка' });
//       } else {
//         res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
//       }
//     });
// };

/** убрать лайк с карточки
 * @param req, /cards/:cardId/likes , DELETE method
 * @param url: "http://localhost:3000/cards/641c0bc1dd5e92e6717d97bd/likes"
 */
const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    // убрать _id из массива польз-ля
    .orFail(new Error('idNotFoundError'))
    .then((card) => res.send({ data: card })) // res.status(200) по дефолту
    .catch((err) => {
      if (err.message === 'idNotFoundError') {
        res.status(ERR_CODE_404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_400).send({ message: 'Переданы некорректные данные для снятии лайка' });
      } else {
        res.status(ERR_CODE_500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
