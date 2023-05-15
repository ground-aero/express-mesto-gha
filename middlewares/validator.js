/** Валидировать приходящие на сервер запросы.
 * Тела запросов к серверу должны валидироваться до передачи обработки в контроллеры.
 * API должен возвращать ошибку, если запрос не соответствует схеме, которую мы определили. */
const { celebrate, Joi } = require('celebrate');
// const login = require('../controllers/users');

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }).unknown(true),
});

const createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }).unknown(true),
});

const userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
});

const updateProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});

const cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports = {
  loginValidator,
  createUserValidator,
  userIdValidator,
  updateProfileValidator,
  updateAvatarValidator,
  cardValidator,
  cardIdValidator,
};
