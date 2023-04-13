/** директория routes/ содержит описание основных роутов для пользователя и карточки. */
const router = require('express').Router();
const {
  updateProfileInfo,
  getUsers,
  getUserById,
  updateAvatar,
} = require('../controllers/users');

/** 'users' можем удалить, роут теперь работает относительно урла, а не всего приложения */
// создаёт пользователя
// router.post('/', createUser); // В теле запроса на создание польз передайте JSON-объект
// с тремя полями: name,about, avatar
// router.post('auth/local', login); // - здесь не нужен !??

router.patch('/me', updateProfileInfo); // PATCH /users/me — обновляет профиль */
router.patch('/me/avatar', updateAvatar); // PATCH /users/me/avatar — обновляет аватар

router.get('/', getUsers); // возвр. всех польз-лей, 'users' можем удалять. 2-й аргумент это ф-ция контроллер.
router.get('/:userId', getUserById); // возвращает пользователя по _id. 2-й аргумент -это ф-ция контроллер.

/** экспортируем сущность которая внутри данного файла. Он отвечает только за юзера (!) */
module.exports = router;
