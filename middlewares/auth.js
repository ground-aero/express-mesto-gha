// Мидлвэр авторизации. должен верифицировать токен из заголовков
// Если с токеном всё в порядке, мидлвэр должен добавлять пейлоуд токена в объект запроса
// и вызывать next:
const jsonwebtoken = require('jsonwebtoken');
const AuthoErr = require('../errors/autho-err');

// этот мидлвэр будет вызываться на каждый запрос,
// должен проверять хедер определенных запросов на наличие авторизации
const auth = (req, res, next) => {
// ToDo: check token valid, and go next. If (valid) {go next}, else error
  // взять заголовок authorization
  const { authorization } = req.headers;
  // если загол. authorization не передан, или не начин. с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthoErr('Необходима авторизация *'); // генерим ошибку в синхронном коде
  }

  //  достать jwt из authorization хедера, удалить Bearer из загол
  const jwt = authorization.replace('Bearer ', '');
  let payload;

  try {
    // проверить что jwt валидный, с помощью библиотеки jsonwebtoken
    payload = jsonwebtoken.verify(jwt, 'some-secret-key');
  } catch (error) {
    throw new AuthoErr('Необходима авторизация **');
    // res.status(401).send({ message: 'Необходима авторизация' });
  }
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   throw new AuthoErr('Необходима авторизация *'); // генерим ошибку в синхронном коде,
  //   // так допустимо.
  //   // Либо через next(new Err..()...) чтобы затем передать в общий обработчик ошибок
  //   // res.status(401).send({ message: 'Требуется авторизация' });
  // }
  //
  // // 2.брать authorization, достать jwt из authorization хедера,
  // // проверить jwt валидный с помощью библиотеки jsonwebtoken что
  // let payload;
  // const jwt = authorization.replace('Bearer ', '');
  // try {
  //   payload = jsonwebtoken.verify(jwt, 'some-secret-key');
  // } catch (err) {
  //   return next(new AuthoErr('Необходима авторизация-'));
  //   // res.status(401).send({ message: 'Необходима авторизация' });
  // }

  // добавить пейлоуд токена в объект запроса юзера !!!!!!!!!!!!
  req.user = payload; // 3.если все хорошо -> иди дальше 'go next' (пропустить запрос)
  next();
};
// const auth = (req, res, next) => {
// // ToDo: check token valid, and go next. If (valid) {go next}, else error
//   // 1.достать 'Bearer' из хедера авторизации, проверять authorization
//   const { authorization } = req.headers;
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     throw new AuthoErr({ message: 'Необходима авторизация *' });
//     // res.status(401).send({ message: 'Требуется авторизация' });
//   }
//
//   // 2.брать authorization, достать jwt из authorization хедера,
//   // проверить jwt валидный с помощью библиотеки jsonwebtoken что
//   let payload;
//   const jwt = authorization.replace('Bearer ', '');
//   try {
//     payload = jsonwebtoken.verify(jwt, 'some-secret-key');
//   } catch (err) {
//     throw new AuthoErr('Необходима авторизация **');
//     // res.status(401).send({ message: 'Необходима авторизация' });
//   }
//   // добавить пейлоуд токена в объект запроса юзера
//   req.user = payload;
//   // 3.если все хорошо -> иди дальше 'go next' (пропустить запрос)
//   next();
// };
// module.exports = (req, res, next) => {
//   // ToDo: check token, get user from DB, return username and email
//
//   // проверка на authorization headers
//   const { authorization } = req.headers;
//   // Если с токеном что-то не так, мидлвэр должен вернуть ошибку 401.
//   if (!authorization || authorization.startsWith('Bearer')) {
//     res.status(401).send({ message: 'Необходима авторизация' })
//   }
//   //   req.user = payload;
//
//   res.status(200).send({message: 'auth Ok'});
//
//   next();
// };

module.exports = auth;
