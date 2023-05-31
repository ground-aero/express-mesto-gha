/** Мидлвэр авторизации. должен верифицировать токен из заголовков
 * Если с токеном всё в порядке, мидлвэр должен добавлять пейлоуд токена в объект запроса
 * и вызывать next: */
const jsonwebtoken = require('jsonwebtoken');
const AuthoErr = require('../errors/autho-err');
const { JWT_SECRET } = require('../config');

/** этот мидлвэр будет вызываться на каждый запрос.
 * должен проверять хедер определенных запросов на наличие авторизации */
const auth = (req, res, next) => {
// ToDo: check token valid, and go next. If (valid) {go next}, else error
  /** взять заголовок authorization */
  const { authorization } = req.headers;
  // если загол. authorization не передан, или не начин. с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthoErr('Необходима авторизация *');
  }

  /** достать jwt из authorization хедера, удалить Bearer из загол */
  const jwt = authorization.replace('Bearer ', '');
  let payload;

  try {
    /** проверить что jwt валидный, с помощью библ jsonwebtoken */
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (error) {
    throw new AuthoErr('передан неверный логин или пароль -');
  }

  /** добавить пейлоуд токена в объект запроса юзера ! */
  req.user = payload; // 3.если все хорошо -> дальше 'go next' (пропустить запрос)
  return next();
};

module.exports = auth;
