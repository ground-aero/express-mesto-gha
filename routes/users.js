/** директория routes/ для users содержит описание основных роутов для пользователя. */
const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfileInfo,
  updateAvatar,
} = require('../controllers/users');
const { userIdValidator, updateProfileValidator, updateAvatarValidator } = require('../middlewares/validator');

/** 'users' можем удалить, роут теперь работает относительно урла, а не всего приложения */
router.get('/', getUsers); // возвр. всех польз-лей, 'users' можем удалять. 2-й арг. это ф-ция контроллер.
router.get('/me', getCurrentUser); // возвращает инф о текущем пользователе.
// в '/me' итак передается authorization header, поэтому не нужно 2-й раз его защищать

router.get('/:userId', userIdValidator, getUserById); // возвращает пользователя по _id. 2-й аргумент -это ф-ция контроллер.
router.patch('/me', updateProfileValidator, updateProfileInfo); // PATCH /users/me — обновляет профиль */
router.patch('/me/avatar', updateAvatarValidator, updateAvatar); // PATCH /users/me/avatar — обновляет аватар

/** экспортируем сущность которая внутри данного файла. Он отвечает только за юзера (!) */
module.exports = router;
