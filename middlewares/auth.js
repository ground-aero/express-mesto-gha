// Мидлвэр для авторизации. должен верифицировать токен из заголовков
// Если с токеном всё в порядке, мидлвэр должен добавлять пейлоуд токена в объект запроса
// и вызывать next:

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
