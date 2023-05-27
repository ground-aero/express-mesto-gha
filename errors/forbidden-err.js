// когда пользователь пытается удалить карточку которая ему не принадлежит
class ForbiddenErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenErr;
